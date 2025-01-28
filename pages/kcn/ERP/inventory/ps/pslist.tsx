'use client';
import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { SidebarComponent, SidebarType, ContextMenuComponent, MenuItemModel, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ChangeEventArgs as ChangeEventArgsInput, FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, Inject, Page, Edit, Sort, Filter, Group, Resize, Reorder, Selection, ExcelExport, PdfExport } from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import moment from 'moment';
import swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import styles from './pslist.module.css';
import  checkboxTemplateListPS  from './component/fungsiFormCreatePS';
import { GetListPS } from './model/api';
import { FillFromSQL, appBackdate } from '@/utils/routines';
import Draggable from 'react-draggable';
import withReactContent from 'sweetalert2-react-content';

// export const dynamic = "force-dynamic";

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import DialogCreatePS from './component/dialogCreatePS';
enableRipple(true);

import { useSession } from '@/pages/api/sessionContext';
import axios from 'axios';
import { GetPeriode } from '../ttb/model/api';
import { usersMenu } from '@/utils/routines';

const PSList = () => {
  const { sessionData, isLoading } = useSession();
  const kode_entitas = sessionData?.kode_entitas ?? '';
  const userid = sessionData?.userid ?? '';
  const kode_user = sessionData?.kode_user ?? '';
  const token = sessionData?.token ?? '';

  if (isLoading) {
    return;
  }

  //======= Setting hak akses user ... ========
  let disabledBaru = false;
  let disabledEdit = false;
  let disabledHapus = false;
  let disabledCetak = false;

  let sidebarObj: SidebarComponent;
  let type: SidebarType = 'Push';
  let mediaQueryState: string = '(min-width: 600px)';

  // State Baru Untuk PS
  interface UserMenuState {
    baru: any;
    edit: any;
    hapus: any;
    cetak: any;
  }
  const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '' });
  const kode_menu = '40800';

  const [recordsData, setRecordsData] = useState<any[]>([]);
  const [dataTemp, setDataTemp] = useState<any>([]);

  const [listGudang, setlistGudang] = useState<any[]>([]);

  let gridListData: Grid | any;
  let selectedListData: any[] = [];
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailDok, setDetailDok] = useState<any[]>([]);
  const [detailJurnal, setDetailJurnal] = useState<any[]>([]);

  const [modalPosition, setModalPosition] = useState({ top: '3%', right: '2%', width: '100%', background: '#dedede' });
  const [dataDetailDokPS, setDataDetailDokPS] = useState({ no_ps: '', tgl_ps: '' });
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const styleButton = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
  const styleButtonCetak = { width: 70 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
  const styleButtonDisabled = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#ece7f5' };

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [windowHeight, setWindowHeight] = useState(0);
  const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';
  const [valueAppBackdate, setValueAppBackdate] = useState(true);

  //======== Setting hint / tooltip untuk grid List Data ========
  let tooltipListData: Tooltip | any;

  //////////////////////////
  // ** FILTER SIDEBAR ** //
  //////////////////////////

  //No. Faktur
  const [noPSValue, setNoPSValue] = useState<string>('');
  const [isNoPSChecked, setIsNoPSChecked] = useState<boolean>(false);

  const handleNoFakturInputChange = (event: string, setNoPSValue: Function, setIsNoPSChecked: Function) => {
    const newValue = event;
    setNoPSValue(newValue);
    setIsNoPSChecked(newValue.length > 0);
  };

  //Tanggal
  const [date1, setDate1] = useState<moment.Moment>(moment());
  const [date2, setDate2] = useState<moment.Moment>(moment().endOf('month'));
  const [isDateRangeChecked, setIsDateRangeChecked] = useState<boolean>(true);

  const HandleTgl = async (date: any, tipe: string, setDate1: Function, setDate2: Function, setIsDateRangeChecked: Function) => {
    if (tipe === 'tanggalAwal') {
      setDate1(date);
      setIsDateRangeChecked(true);
    } else {
      setDate2(date);
      setIsDateRangeChecked(true);
    }
  };

  //Gudang
  const [selectedOptionGudang, setSelectedOptionGudang] = useState<string>('');
  const [isGudangChecked, setIsGudangChecked] = useState<boolean>(false);

  const HandleGudangChange = (event: string, setSelectedOptionGudang: Function, setIsGudangChecked: Function) => {
    const newValue = event;
    setSelectedOptionGudang(newValue);
    setIsGudangChecked(newValue.length > 0);
  };

  //Penyesuaian Nilai
  const [selectedRadioNilai_adjValue, setSelectedRadioNilai_adjValue] = useState<string | null>('all');

  const handleRadioNilai_adjChange = (value: string) => {
    setSelectedRadioNilai_adjValue(value);
  };

  //RebuildStok
  const [selectedRadioRebuildStokValue, setSelectedRadioRebuildStokValue] = useState<string | null>('all');

  const handleRadioRebuildStokChange = (value: string) => {
    setSelectedRadioRebuildStokValue(value);
  };

  const fetchDataUseEffect = async () => {
    let paramObject = {
      kode_entitas: kode_entitas,
      vParam1: selectedRadioNilai_adjValue,
      vParam2: selectedRadioRebuildStokValue,
      vParam3: isNoPSChecked ? noPSValue : 'all',
      vParam4: isDateRangeChecked ? date1.format('YYYY-MM-DD') : 'all',
      vParam5: isDateRangeChecked ? date2.format('YYYY-MM-DD') : 'all',
      vParam6: isGudangChecked ? selectedOptionGudang : 'all',
      vParam7: 1000,
    };

    const responseData: any[] = await GetListPS(paramObject);

    const formattedResponseData = responseData.map((item) => {
      // format netto
      let formattedNettoRP = parseFloat(item.netto_rp).toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });

      // handle nilai negatif
      if (parseFloat(item.netto_rp) < 0) {
        formattedNettoRP = `(${Math.abs(parseFloat(item.netto_rp)).toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })})`;
      }

      const formattedDate = moment(item.tgl_ps).format('DD-MM-YYYY');
      return {
        ...item,
        tgl_ps: formattedDate,
        netto_rp: formattedNettoRP,
      };
    });

    setRecordsData(formattedResponseData);

    const gudangApi = await FillFromSQL(kode_entitas, 'gudang', kode_user)
      .then((result) => {
        setlistGudang(result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    await appBackdate(kode_entitas, userid)
      .then((result) => {
        setValueAppBackdate(result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    fetchDataUseEffect();
  }, []);

  //////////////////////////////
  // ** END FILTER SIDEBAR ** //
  //////////////////////////////

  /////////////////////////
  // ** FILTER HEADER ** //
  /////////////////////////

  const [searchNoPS, setSearchNoPS] = useState('');
  const [searchKeterangan, setSearchKeterangan] = useState('');

  const PencarianNoKeterangan = async (event: string, setSearchNoReff: Function, setFilteredData: Function, recordsData: any[]) => {
    const searchValue = event;
    setSearchNoReff(searchValue);
    const filteredData = SearchDataKeterangan(searchValue, recordsData);
    setFilteredData(filteredData);

    const cariNoPS = document.getElementById('cariNoPS') as HTMLInputElement;
    if (cariNoPS) {
      cariNoPS.value = '';
    }
  };

  const SearchDataKeterangan = (keyword: any, recordsData: any[]) => {
    if (keyword === '') {
      return recordsData;
    } else {
      const filteredData = recordsData.filter((item) => item.keterangan.toLowerCase().startsWith(keyword.toLowerCase()));
      return filteredData;
    }
  };

  const PencarianNoPS = async (event: string, setSearchNoPS: Function, setFilteredData: Function, recordsData: any[]) => {
    const searchValue = event;
    setSearchNoPS(searchValue);
    const filteredData = SearchDataNoPS(searchValue, recordsData);
    setFilteredData(filteredData);

    const keterangan = document.getElementById('keterangan') as HTMLInputElement;
    if (keterangan) {
      keterangan.value = '';
    }
  };

  const SearchDataNoPS = (keyword: any, recordsData: any[]) => {
    if (keyword === '') {
      return recordsData;
    } else {
      const filteredData = recordsData.filter((item) => item.no_ps.toLowerCase().startsWith(keyword.toLowerCase()));
      return filteredData;
    }
  };

  /////////////////////////////
  // ** END FILTER HEADER ** //
  /////////////////////////////

  /////////////////////////
  // ** REFRESH DATA **  //
  /////////////////////////

  const handleRefreshData = async () => {
    await setSearchNoPS('');
    await setSearchKeterangan('');
    // await setRecordsData([]);

    try {
      let paramObject = {
        kode_entitas: kode_entitas,
        vParam1: selectedRadioNilai_adjValue,
        vParam2: selectedRadioRebuildStokValue,
        vParam3: isNoPSChecked ? noPSValue : 'all',
        vParam4: isDateRangeChecked ? date1.format('YYYY-MM-DD') : 'all',
        vParam5: isDateRangeChecked ? date2.format('YYYY-MM-DD') : 'all',
        vParam6: isGudangChecked ? selectedOptionGudang : 'all',
        vParam7: 1000,
      };

      const responseData: any[] = await GetListPS(paramObject);

      console.log('responseData : ', responseData);

      const formattedResponseData = responseData.map((item) => {
        // format netto
        let formattedNettoRP = parseFloat(item.netto_rp).toLocaleString('en-US', {
          minimumFractionDigits: 2,
        });

        // handle nilai negatif
        if (parseFloat(item.netto_rp) < 0) {
          formattedNettoRP = `(${Math.abs(parseFloat(item.netto_rp)).toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })})`;
        }

        const formattedDate = moment(item.tgl_ps).format('DD-MM-YYYY');
        return {
          ...item,
          tgl_ps: formattedDate,
          netto_rp: formattedNettoRP,
        };
      });

      setRecordsData(formattedResponseData);

      const gudangApi = await FillFromSQL(kode_entitas, 'gudang', kode_user)
        .then((result) => {
          setlistGudang(result);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  ////////////////////////////
  // ** END REFRESH DATA ** //
  ////////////////////////////

  //==========  Popup menu untuk header grid List Data ===========
  let menuHeaderItems: MenuItemModel[] = [
    {
      iconCss: 'e-icons e-print',
      text: 'Cetak ke printer',
    },
    {
      iconCss: 'e-icons',
      text: 'Export ke file',
      items: [
        { iconCss: 'e-icons e-export-pdf', text: 'PDF' },
        { iconCss: 'e-icons e-export-excel', text: 'XLSX' },
        { iconCss: 'e-icons e-export-csv', text: 'CSV' },
      ],
    },
  ];

  function menuHeaderSelect(args: MenuEventArgs) {
    if (args.item.text === 'Cetak ke printer') {
      gridListData.print();
    } else if (args.item.text === 'PDF') {
      gridListData.showSpinner();
      gridListData.pdfExport();
    } else if (args.item.text === 'XLSX') {
      gridListData.showSpinner();
      gridListData.excelExport();
    } else if (args.item.text === 'CSV') {
      gridListData.showSpinner();
      gridListData.csvExport();
    }
  }
  const ExportComplete = (): void => {
    gridListData.hideSpinner();
  };

  //================ Disable hari minggu di calendar ==============
  function onRenderDayCell(args: RenderDayCellEventArgs): void {
    if ((args.date as Date).getDay() === 0) {
      args.isDisabled = true;
    }
  }

  // ===========================================================================================

  // ================== Fungsi Reload untuk Responsive sidebar filter ==========================
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      if (window.innerWidth < 800) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // const onCreate = () => {
  //     sidebarObj.element.style.visibility = '';
  // };
  const toggleClick = () => {
    setSidebarVisible(true);
  };
  const closeClick = () => {
    setSidebarVisible(false);
  };

  // ===========================================================================================

  const closeModal = () => {
    setSelectedItem(null);
  };

  const [modalHandleDataPS, setModalHandleDataPS] = useState(false);

  const [statusPage, setStatusPage] = useState('');

  const [selectedRow, setSelectedRow] = useState<any>('');

  const [tglPs, setTglPs] = useState('');
  const handleRowSelected = (args: any) => {
    const [day, month, year] = args.data.tgl_ps.split('-');
    const formattedDate = year + month;
    console.log('formattedDate = ', formattedDate);

    setSelectedRow(args.data.kode_ps);
    setTglPs(formattedDate);
  };

  const handleNavigateLink = async (jenis: any) => {
    setModalHandleDataPS(false);
    const responseData: any[] = await GetPeriode(kode_entitas);
    const periode = responseData[0].periode;
    const tanggalMomentPeriode = moment(periode, 'YYYYMM');
    const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

    const tglPembanding = moment(tglPs).format('YYYYMM');

    // Mendapatkan tahun dan bulan dari setiap tanggal
    const yearA = parseInt(periodeTahunBulan.substring(0, 4));
    const monthA = parseInt(periodeTahunBulan.substring(4, 6));

    const yearB = parseInt(tglPembanding.substring(0, 4));
    const monthB = parseInt(tglPembanding.substring(4, 6));

    if (yearB < yearA || (yearB === yearA && monthB < monthA)) {
      withReactContent(swalToast).fire({
        icon: 'warning',
        title: '<p style="font-size:12px; color:white;">Tanggal Transaksi lebih kecil dari periode yang sekarang, tidak bisa dikoreksi.</p>',
        width: '100%',
        timer: 3000,
        customClass: {
          popup: styles['colored-popup'], // Custom class untuk sweetalert
        },
      });
    } else {
      if (jenis === 'edit') {
        if (selectedRow) {
          setStatusPage('EDIT');
          setModalHandleDataPS(true);
        } else {
          swal.fire({
            title: 'Warning',
            text: 'Silahkan pilih data terlebih dahulu.',
            icon: 'warning',
          });
        }
      } else if (jenis === 'create') {
        setStatusPage('CREATE');
        setModalHandleDataPS(true);
      }
    }
  };

  /// DETAIL DOK ///

  const router = useRouter();

  const [state, setState] = useState({
    content: 'Detail Dok',
    iconCss: 'e-icons e-medium e-chevron-down',
  });

  const swalToast = swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 3000,
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

  const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

  const DataDetailDok = async (selectedRow: any, kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/detail_dok_ps?`, {
      params: {
        entitas: kode_entitas,
        param1: selectedRow,
      },
    });
    const listDetailDok = response.data.data.detail;
    return listDetailDok;
  };

  const DataJurnalDok = async (selectedRow: any, kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/detail_dok_ps?`, {
      params: {
        entitas: kode_entitas,
        param1: selectedRow,
      },
    });
    const listDetailDok = response.data.data.jurnal;
    return listDetailDok;
  };

  const ListDetailDok = async (selectedRow: any, kode_entitas: any, setDetailDok: Function) => {
    try {
      const result: any[] = await DataDetailDok(selectedRow, kode_entitas);
      const result2: any[] = await DataJurnalDok(selectedRow, kode_entitas);
      setDetailDok(result);
      setDetailJurnal(result2);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const ButtonDetailDok = (selectedRow: any) => {
    console.log(selectedRow, 'selectedRow');
    return selectedRow;
  };

  const SetDataDokumenPS = async (tipe: string, selectedRow: string, kode_entitas: string, setSelectedItem: Function, setDetailDok: Function) => {
    if (selectedRow !== '') {
      if (tipe === 'detailDok') {
        const result = ButtonDetailDok(selectedRow);
        setSelectedItem(result);
        ListDetailDok(result, kode_entitas, setDetailDok);
      } else if (tipe === 'cetak') {
        OnClick_CetakFormPS(selectedRow, kode_entitas, './report/form_ps');
      } else if (tipe === 'cetakDenganNilai') {
        OnClick_CetakFormPS(selectedRow, kode_entitas, './report/form_ps_dengan_nilai');
      }
    } else {
      withReactContent(swalToast).fire({
        icon: 'warning',
        title: '<p style="font-size:12px; color:white;">Silahkan pilih data terlebih dahulu</p>',
        width: '100%',
        customClass: {
          popup: styles['colored-popup'],
        },
      });
    }
  };

  const RowSelectingListData = (args: any, setDataDetailDokPS: Function, kode_entitas: string, setDetailDok: Function) => {
    ListDetailDok(args.data.kode_ps, kode_entitas, setDetailDok);
    setDataDetailDokPS((prevState: any) => ({
      ...prevState,
      no_ps: args.data.no_ps,
      tgl_ps: args.data.tgl_ps,
    }));
  };

  // List gudang untuk detail //

  const [listGudangforDetail, setlistGudangforDetail] = useState<any[]>([]);

  const apiGudang = async () => {
    try {
      const response = await axios.get(`${apiUrl}/erp/list_gudang_forfilter?`, {
        params: {
          entitas: kode_entitas,
          param1: kode_user,
        },
      });
      const responseData = response.data.data;
      const transformedData_getGudang = responseData.map((item: any) => ({
        kode_gudang: item.kode_gudang,
        nama_gudang: item.nama_gudang,
      }));

      setlistGudangforDetail(transformedData_getGudang);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    apiGudang();
  }, [kode_entitas, kode_user]);

  // Cetak //
  let cMenuCetak: ContextMenuComponent;

  function btnPrintClick(e: any): void {
    var clientRect = (e.target as Element).getBoundingClientRect();
    cMenuCetak.open(clientRect.bottom, clientRect.left);
  }

  let menuCetakItems: MenuItemModel[] = [
    {
      iconCss: 'e-icons e-thumbnail',
      text: 'Form Penyesuaian Stok',
    },
    {
      iconCss: 'e-icons e-thumbnail',
      text: 'Form Penyesuaian Stok dengan Nilai',
    },
  ];

  function menuCetakSelect(args: MenuEventArgs) {
    if (args.item.text === 'Form Penyesuaian Stok') {
      OnClick_CetakFormPS(selectedRow, kode_entitas, './report/form_ps');
    } else if (args.item.text === 'Form Penyesuaian Stok dengan Nilai') {
      OnClick_CetakFormPS(selectedRow, kode_entitas, './report/form_ps_dengan_nilai');
    }
  }

  const OnClick_CetakFormPS = (selectedRow: any, kode_entitas: string, url: string) => {
    if (selectedRow === '') {
      withReactContent(swalToast).fire({
        icon: 'warning',
        title: '<p style="font-size:12px;color:white;">Silahkan pilih data terlebih dahulu</p>',
        width: '100%',
        customClass: {
          popup: styles['colored-popup'],
        },
      });
      return;
    }

    let height = window.screen.availHeight - 150;
    let width = window.screen.availWidth - 200;
    let leftPosition = window.screen.width / 2 - (width / 2 + 10);
    let topPosition = window.screen.height / 2 - (height / 2 + 50);

    let iframe = `
        <html><head>
        <title>Form Penyesuaian Stok | Next KCN Sytem</title>
        <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
        </head><body>
        <iframe src="${url}?entitas=${kode_entitas}&kode_ps=${selectedRow}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
        </body></html>`;

    let win = window.open(
      '',
      '_blank',
      `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
    );

    if (win) {
      let link = win.document.createElement('link');
      link.type = 'image/png';
      link.rel = 'shortcut icon';
      link.href = '/favicon.png';
      win.document.getElementsByTagName('head')[0].appendChild(link);
      win.document.write(iframe);
    } else {
      console.error('Window failed to open.');
    }
  };

  useEffect(() => {
    const fetchUserMenu = async () => {
      await usersMenu(kode_entitas, userid, kode_menu)
        .then((res) => {
          const { baru, edit, hapus, cetak } = res;
          setUserMenu((prevState) => ({
            ...prevState,
            baru,
            edit,
            hapus,
            cetak,
          }));
        })
        .catch((err) => {
          console.error('Error: ', err);
        });
    };

    fetchUserMenu();
  }, []);

  return (
    <div className="Main" id="main-target">
      {/*==================================================================================================*/}
      {/*================================ Tampilan utama Tanda Terima Barang =============================*/}
      {/*==================================================================================================*/}
      <div>
        <div style={{ minHeight: '40px', marginTop: '-3px', marginBottom: '11px' }}>
          <TooltipComponent content="Tampilkan filter data" opensOn="Hover" openDelay={1000} target="#btnFilter">
            <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} target="#btnRefresh">
              <TooltipComponent content="Membuat tanda terima barang baru" opensOn="Hover" openDelay={1000} target="#btnBaru">
                <TooltipComponent content="Edit data tanda terima barang" opensOn="Hover" openDelay={1000} target="#btnEdit">
                  <TooltipComponent content="Hapus data tanda terima barang" opensOn="Hover" openDelay={1000} target="#btnHapus">
                    <TooltipComponent content="Cetak data tanda terima barang" opensOn="Hover" openDelay={1000} target="#btnCetak">
                      <TooltipComponent content="Tampilkan detail tanda terima barang" opensOn="Hover" openDelay={1000} target="#btnDetail">
                        <TooltipComponent content="Persetujuan dokumen" opensOn="Hover" openDelay={1000} target="#btnApproval">
                          <div style={{ marginTop: -5 }} className="mb-5 flex flex-col md:flex-row md:justify-between">
                            <div className="flex flex-wrap items-center">
                              <ButtonComponent
                                id="btnBaru"
                                cssClass="e-primary e-small"
                                style={userMenu.baru === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? { ...styleButton } : { ...styleButtonDisabled, color: '#1c1b1f61' }}
                                disabled={userMenu.baru === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
                                // onClick={CreateData}
                                onClick={() => handleNavigateLink('create')}
                                content="Baru"
                              ></ButtonComponent>

                              <ButtonComponent
                                id="btnUbah"
                                cssClass="e-primary e-small"
                                style={userMenu.edit === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? { ...styleButton } : { ...styleButtonDisabled, color: '#1c1b1f61' }}
                                disabled={userMenu.edit === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
                                onClick={() => handleNavigateLink('edit')}
                                // disabled={userMenu.edit === 'Y' ? false : true}
                                content="Ubah"
                              ></ButtonComponent>

                              <ButtonComponent
                                id="btnFilter"
                                cssClass="e-primary e-small"
                                style={sidebarVisible ? { width: '57px', height: '28px', marginBottom: '0.5em', marginTop: '0.5em', marginRight: '0.8em' } : { ...styleButton, color: 'white' }}
                                disabled={sidebarVisible}
                                onClick={toggleClick}
                                content="Filter"
                              ></ButtonComponent>

                              <ButtonComponent
                                id="btnDetail"
                                cssClass="e-primary e-small"
                                style={{
                                  width: 100 + 'px',
                                  marginBottom: '0.5em',
                                  marginTop: 0.5 + 'em',
                                  marginRight: 0.8 + 'em',
                                  backgroundColor: '#e6e6e6',
                                  color: 'black',
                                }}
                                disabled={false}
                                onClick={() => SetDataDokumenPS('detailDok', selectedRow, kode_entitas, setSelectedItem, setDetailDok)}
                                iconCss={state.iconCss}
                                content={state.content}
                              ></ButtonComponent>

                              <ContextMenuComponent
                                id="cMenuCetak"
                                ref={(scope) => (cMenuCetak = scope as ContextMenuComponent)}
                                items={menuCetakItems}
                                select={menuCetakSelect}
                                animationSettings={{ duration: 800, effect: 'FadeIn' }}
                              />

                              <ButtonComponent
                                id="btnCetak"
                                cssClass="e-primary e-small"
                                style={userMenu.cetak === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? { ...styleButtonCetak } : { ...styleButtonDisabled, color: '#1c1b1f61' }}
                                disabled={userMenu.cetak === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
                                onClick={btnPrintClick}
                                content="Cetak"
                                iconCss="e-icons e-medium e-chevron-down"
                                iconPosition="Right"
                              ></ButtonComponent>

                              <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                <TextBoxComponent
                                  id="cariNoPS"
                                  className="searchtext"
                                  placeholder="Cari Nomor PS"
                                  showClearButton={true}
                                  input={(args: ChangeEventArgsInput) => {
                                    const value: any = args.value;
                                    PencarianNoPS(value, setSearchNoPS, setFilteredData, recordsData);
                                  }}
                                  floatLabelType="Never"
                                />
                              </div>

                              <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                <TextBoxComponent
                                  id="keterangan"
                                  className="searchtext"
                                  placeholder="Keterangan"
                                  showClearButton={true}
                                  input={(args: ChangeEventArgsInput) => {
                                    const value: any = args.value;
                                    PencarianNoKeterangan(value, setSearchKeterangan, setFilteredData, recordsData);
                                  }}
                                  floatLabelType="Never"
                                />
                              </div>
                            </div>

                            <div className="mt-2 flex items-center md:mt-0">
                              <span style={{ fontSize: 16 }} className="font-serif text-xl">
                                Penyesuaian dan Rebuild Stok (PS)
                              </span>
                            </div>
                          </div>
                        </TooltipComponent>
                      </TooltipComponent>
                    </TooltipComponent>
                  </TooltipComponent>
                </TooltipComponent>
              </TooltipComponent>
            </TooltipComponent>
          </TooltipComponent>
        </div>

        <div style={{ background: '#dedede', width: '20%', visibility: sidebarVisible ? 'visible' : 'hidden', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', position: 'fixed' }}>
          <div className="flex items-center text-center">
            <div style={{ width: '11%', marginLeft: '17px' }}>
              <div className="shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                  <path
                    opacity="0.5"
                    d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M7 10.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M9 17.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path
                    d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
            <div style={{ width: '79%' }}>
              <h5 style={{ textAlign: 'left' }} className="text-lg font-bold">
                Filtering Data
              </h5>
            </div>
            <div style={{ width: '10%', marginLeft: '-25px' }}>
              <button
                //onClick={toggleFilterData}
                onClick={closeClick}
              >
                <FontAwesomeIcon icon={faTimes} width="18" height="18" />
              </button>
            </div>
          </div>
          <div className="mb-5 mt-3 h-px w-full border-b border-black dark:border-[#1b2e4b]"></div>
        </div>

        <div className="flex">
          <div style={{ width: '20%', visibility: sidebarVisible ? 'visible' : 'hidden' }}>
            <div className="panel-filter" style={{ background: '#dedede', width: '100%', overflowY: 'auto', marginTop: '52px', height: '645px' }}>
              <div className="flex">
                <CheckBoxComponent
                  label="No. PS"
                  checked={isNoPSChecked}
                  change={(args: ChangeEventArgsButton) => {
                    const value: any = args.checked;
                    setIsNoPSChecked(value);
                  }}
                  style={{ borderRadius: 3, borderColor: 'gray' }}
                />
              </div>

              <div className="mt-1 flex justify-between">
                <div className="container form-input">
                  <TextBoxComponent
                    placeholder=""
                    value={noPSValue}
                    input={(args: FocusInEventArgs) => {
                      const value: any = args.value;
                      handleNoFakturInputChange(value, setNoPSValue, setIsNoPSChecked);
                    }}
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-between">
                <CheckBoxComponent
                  label="Tanggal"
                  checked={isDateRangeChecked}
                  change={(args: ChangeEventArgsButton) => {
                    const value: any = args.checked;
                    setIsDateRangeChecked(value);
                  }}
                />
              </div>

              <div className={`grid grid-cols-1 justify-between gap-1 sm:flex `}>
                <div className="form-input mt-1 flex justify-between">
                  <DatePickerComponent
                    locale="id"
                    style={{ fontSize: '12px' }}
                    cssClass="e-custom-style"
                    renderDayCell={onRenderDayCell}
                    enableMask={true}
                    maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                    showClearButton={false}
                    format="dd-MM-yyyy"
                    value={date1.toDate()}
                    change={(args: ChangeEventArgsCalendar) => {
                      HandleTgl(moment(args.value), 'tanggalAwal', setDate1, setDate2, setIsDateRangeChecked);
                    }}
                  >
                    <Inject services={[MaskedDateTime]} />
                  </DatePickerComponent>
                </div>
                <p className="set-font-11 ml-0.5 mr-0.5 mt-3 flex justify-between">s/d</p>
                <div className="form-input mt-1 flex justify-between">
                  <DatePickerComponent
                    locale="id"
                    style={{ fontSize: '12px' }}
                    cssClass="e-custom-style"
                    renderDayCell={onRenderDayCell}
                    enableMask={true}
                    maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                    showClearButton={false}
                    format="dd-MM-yyyy"
                    value={date2.toDate()}
                    change={(args: ChangeEventArgsCalendar) => {
                      HandleTgl(moment(args.value), 'tanggalAkhir', setDate1, setDate2, setIsDateRangeChecked);
                    }}
                  >
                    <Inject services={[MaskedDateTime]} />
                  </DatePickerComponent>
                </div>
              </div>

              <div className="mt-2 flex justify-between">
                <CheckBoxComponent
                  label="Gudang"
                  checked={isGudangChecked}
                  change={(args: ChangeEventArgsButton) => {
                    const value: any = args.checked;
                    setIsGudangChecked(value);
                  }}
                />
              </div>

              <div className="mt-1 flex justify-between">
                <div className="container form-input">
                  <DropDownListComponent
                    id="gudang"
                    className="form-select"
                    dataSource={listGudangforDetail.map((data: any) => data.nama_gudang)}
                    placeholder="--Silahkan Pilih--"
                    change={(args: ChangeEventArgsDropDown) => {
                      const value: any = args.value;
                      HandleGudangChange(value, setSelectedOptionGudang, setIsGudangChecked);
                    }}
                    value={selectedOptionGudang}
                  />
                </div>
              </div>

              <div className="mt-2">
                <div className="font-bold">
                  <span style={{ fontWeight: 'bold' }}>Penyesuaian Nilai</span>
                </div>
              </div>
              <div className="mt-1">
                <div className="flex">
                  <input type="radio" name="adj_value" id="ya" className="form-radio" onChange={() => handleRadioNilai_adjChange('Y')} />
                  <label htmlFor="ya" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                    YA
                  </label>
                </div>

                <div className="flex">
                  <input type="radio" name="adj_value" id="tidak" className="form-radio" onChange={() => handleRadioNilai_adjChange('N')} />
                  <label htmlFor="ya" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                    Tidak
                  </label>
                </div>

                <div className="flex">
                  <input type="radio" name="adj_value" id="semua" className="form-radio" defaultChecked={selectedRadioNilai_adjValue === 'all'} onChange={() => handleRadioNilai_adjChange('all')} />
                  <label htmlFor="ya" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                    Semua
                  </label>
                </div>
              </div>

              <div className="mt-2">
                <div className="font-bold">
                  <span style={{ fontWeight: 'bold' }}>Rebuild Stok</span>
                </div>
              </div>
              <div className="mt-1">
                <div className="flex">
                  <input type="radio" name="rebuild_stok" id="ya" className="form-radio" onChange={() => handleRadioRebuildStokChange('Y')} />
                  <label htmlFor="ya" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                    YA
                  </label>
                </div>

                <div className="flex">
                  <input type="radio" name="rebuild_stok" id="tidak" className="form-radio" onChange={() => handleRadioRebuildStokChange('N')} />
                  <label htmlFor="ya" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                    Tidak
                  </label>
                </div>

                <div className="flex">
                  <input
                    type="radio"
                    name="rebuild_stok"
                    id="semua"
                    className="form-radio"
                    defaultChecked={selectedRadioRebuildStokValue === 'all'}
                    onChange={() => handleRadioRebuildStokChange('all')}
                  />
                  <label htmlFor="ya" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                    Semua
                  </label>
                </div>
              </div>

              <div className="flex justify-center" style={{ marginTop: '228px' }}>
                <ButtonComponent cssClass="e-primary e-small" iconCss="e-icons e-medium e-refresh" content="Refresh Data" style={{ backgroundColor: '#3b3f5c' }} onClick={handleRefreshData} />
              </div>
            </div>
          </div>

          <div style={{ width: '80%' }}>
            {/* ===============  Grid Data ========================   */}
            <div className="panel" style={{ background: '#dedede', margin: sidebarVisible ? '' : 'auto auto auto -25%', overflowY: 'auto' }}>
              <div className="panel-data" style={{ width: '100%' }}>
                <TooltipComponent ref={(t) => (tooltipListData = t)} opensOn="Hover" target=".e-headertext">
                  <TabComponent id="defaultTab">
                    <div className="e-tab-header" style={{ marginBottom: 10 }}>
                      <div> Data List </div>
                    </div>
                    <div className="e-content">
                      <GridComponent
                        ref={(g) => (gridListData = g)}
                        dataSource={searchNoPS !== '' || searchKeterangan !== '' ? filteredData : recordsData}
                        allowExcelExport={true}
                        excelExportComplete={ExportComplete}
                        allowPdfExport={true}
                        pdfExportComplete={ExportComplete}
                        allowPaging={true}
                        allowSorting={true}
                        allowFiltering={false}
                        allowResizing={true}
                        autoFit={true}
                        allowReordering={true}
                        pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                        rowHeight={22}
                        width={'100%'}
                        height={550}
                        gridLines={'Both'}
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowSelected={handleRowSelected}
                        rowSelecting={(args) => RowSelectingListData(args, setDataDetailDokPS, kode_entitas, setDetailDok)}
                        recordDoubleClick={() => {
                          if (userMenu.edit === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR') {
                            handleNavigateLink('edit');
                          }
                        }}
                      >
                        <ColumnsDirective>
                          <ColumnDirective field="no_ps" headerText="No. PS" width="110" textAlign="Center" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                          <ColumnDirective field="tgl_ps" headerText="Tanggal" width="80" textAlign="Center" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                          <ColumnDirective field="nama_gudang" headerText="Gudang" width="180" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                          <ColumnDirective field="netto_rp" headerText="Netto" width="100" textAlign="Right" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                          <ColumnDirective field="keterangan" headerText="Keterangan" width="360" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                          <ColumnDirective field="catatan" headerText="Alasan PS" width="220" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                          <ColumnDirective field="beban" headerText="Pembebanan Karyawan" width="140" textAlign="Center" headerTextAlign="Center" template={checkboxTemplateListPS} />
                          <ColumnDirective field="keterangan_tambahan" headerText="Keterangan Tambahan" width="220" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                        </ColumnsDirective>
                        <Inject services={[Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                      </GridComponent>
                    </div>
                  </TabComponent>
                </TooltipComponent>
                {/*============ Tampilkan popup menu untuk print dan simpan ke file ================*/}
                <ContextMenuComponent id="contextmenu" target=".e-gridheader" items={menuHeaderItems} select={menuHeaderSelect} animationSettings={{ duration: 800, effect: 'FadeIn' }} />
                <style>
                  {`
                                .e-row .e-rowcell:hover {
                                    cursor: pointer;
                                }

                                .e-row.e-selectionbackground {
                                    cursor: pointer;
                                }
                                .e-grid .e-headertext {
                                    font-size: 11px !important;
                                }
                                .e-grid .e-rowcell {
                                    font-size: 11px !important;
                                }
                            `}
                </style>
              </div>
            </div>
          </div>
        </div>
        {/*==================================================================================================*/}
        {selectedItem && (
          <Draggable>
            <div className={`${styles.modalDetailDragable}`} style={modalPosition}>
              <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                <div style={{ marginBottom: 21 }}>
                  <span style={{ fontSize: 18, fontWeight: 500 }}>
                    Detail Penyesuaian dan Rebuild Stok : {dataDetailDokPS.no_ps} - {dataDetailDokPS.tgl_ps}
                  </span>
                </div>
                <GridComponent dataSource={detailDok} width={'80%'} rowHeight={30} gridLines={'Both'} allowSorting={true} ref={(g) => (gridListData = g)}>
                  <ColumnsDirective>
                    <ColumnDirective field="no_item" headerText="No. Barang" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective field="nama_item" headerText="Nama Barang" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective field="satuan" headerText="Satuan" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective field="qty" headerText="Kuantitas" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective
                      field="jumlah_rp"
                      headerText="Nilai Persediaan"
                      textAlign="Center"
                      headerTextAlign="Center"
                      template={(props: any) => {
                        return <span>{props.jumlah_rp ? parseFloat(props.jumlah_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                      }}
                    />
                    <ColumnDirective field="no_kontrak" headerText="No Kontrak" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective field="no_mbref" headerText="Refrensi Mutasi Barang" textAlign="Center" headerTextAlign="Center" />
                  </ColumnsDirective>
                  <Inject services={[Page, Sort, Filter, Group]} />
                </GridComponent>

                <div className="mt-10"></div>

                <GridComponent dataSource={detailJurnal} gridLines={'Both'} rowHeight={30} allowSorting={true} ref={(g) => (gridListData = g)}>
                  <ColumnsDirective>
                    <ColumnDirective field="no_akun" headerText="No. Akun" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective field="nama_akun" width="200" headerText="Nama" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective
                      field="debet_rp"
                      headerText="Debet"
                      textAlign="Center"
                      headerTextAlign="Center"
                      template={(props: any) => {
                        return <span>{props.debet_rp ? parseFloat(props.debet_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                      }}
                    />
                    <ColumnDirective
                      field="kredit_rp"
                      template={(props: any) => {
                        return <span>{props.kredit_rp ? parseFloat(props.kredit_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                      }}
                      headerText="Kredit"
                      textAlign="Center"
                      headerTextAlign="Center"
                    />
                    <ColumnDirective field="catatan" width="250" headerText="Keterangan" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective field="kode_mu" headerText="MU" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective field="kurs" headerText="Kurs" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective
                      field="jumlah_rp"
                      headerText="Jumlah"
                      textAlign="Center"
                      headerTextAlign="Center"
                      template={(props: any) => {
                        return <span>{props.jumlah_rp ? parseFloat(props.jumlah_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                      }}
                    />
                    <ColumnDirective field="nama_subledger" headerText="Subledger" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective field="nama_dept" headerText="Departmen" textAlign="Center" headerTextAlign="Center" />
                    <ColumnDirective field="kode_jual" headerText="Divisi" textAlign="Center" headerTextAlign="Center" />
                  </ColumnsDirective>
                  <Inject services={[Page, Sort, Filter, Group]} />
                </GridComponent>
              </div>
              <button
                className={`${styles.closeButtonDetailDragable}`}
                onClick={() => {
                  closeModal();
                }}
              >
                <FontAwesomeIcon icon={faTimes} width="18" height="18" />
              </button>
            </div>
          </Draggable>
        )}
      </div>
      {modalHandleDataPS && (
        <DialogCreatePS
          userid={userid}
          kode_entitas={kode_entitas}
          isOpen={modalHandleDataPS}
          onClose={() => {
            setModalHandleDataPS(false);
            setStatusPage('');
          }}
          kode_user={kode_user}
          onRefresh={handleRefreshData}
          kode_ps={selectedRow}
          statusPage={statusPage}
          token={token}
          valueAppBackdate={valueAppBackdate}
          dataTemp={dataTemp}
          setDataTemp={setDataTemp}
        />
      )}
    </div>
  );
};

export default PSList;
