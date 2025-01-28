import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import * as React from 'react';
import { CurrencyFormat } from '../functional/fungsiFormPpiList';

interface templateFooterProps {
    userid: any;
    kode_entitas: any;
    setStateDataFooter: Function;
    stateDataFooter: any;
    modalJenisPenerimaan: any;
    // masterKodeDokumen: any;
    // masterDataState: any;
    // isOpen: boolean;
    // onClose: any;
    // kode_user: any;
    // modalJenisPembayaran: any;
}

const TemplateFooter: React.FC<templateFooterProps> = ({
    userid,
    kode_entitas,
    setStateDataFooter,
    stateDataFooter,
    modalJenisPenerimaan
}: // masterKodeDokumen,
// masterDataState,
// isOpen,
// onClose,
// kode_user,
// modalJenisPembayaran,
// selectedKodeSupp,
// onRefreshTipe,
templateFooterProps) => {
    let textareaObj: any;
    function onCreateMultiline(): void {
        textareaObj.addAttributes({ rows: 1 });
        textareaObj.respectiveElement.style.height = 'auto';
        textareaObj.respectiveElement.style.height = '60px'; //textareaObj.respectiveElement.scrollHeight + 'px';
    }
    return (
        <div className="flex">
            <div style={{ width: '80%' }}>
                <div className="mt-1">
                    <p className="set-font-11">
                        <b>Keterangan :</b>
                    </p>
                    <div className="panel-input" style={{ width: '80%' }}>
                        
                        <TextBoxComponent
                            id="vKeterangan"
                            ref={(t) => {
                                textareaObj = t;
                            }}
                            multiline={true}
                            created={onCreateMultiline}
                            value={stateDataFooter?.vKeterangan}
                            input={(args: FocusInEventArgs) => {
                                const value: any = args.value;
                                setStateDataFooter((prevState: any) => ({
                                    ...prevState,
                                    vKeterangan: value,
                                }));
                            }}
                            disabled={modalJenisPenerimaan === 'UpdateFilePendukung' ? true : false}
                        />
                    </div>
                </div>
            </div>
            <div style={{ width: '20%' }}>
                <div className="mt-1 flex">
                    <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                        <b>Total Piutang</b>
                    </div>
                    <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>{<b>{CurrencyFormat(stateDataFooter?.totalPiutang)}</b>}</div>
                </div>
                <div className="flex">
                    <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                        <b>Total Penerimaan</b>
                    </div>
                    <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>{<b>{CurrencyFormat(stateDataFooter?.totalPenerimaan)}</b>}</div>
                </div>
                <div className="flex">
                    <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                        <b>Sisa Piutang</b>
                    </div>
                    <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>{<b>{CurrencyFormat(stateDataFooter?.sisaPiutang)}</b>}</div>
                </div>
                <div className="flex">
                    <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                        <b>Selisih Alokasi Dana</b>
                    </div>
                    <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                        <b>{stateDataFooter?.selisihAlokasiDana < 0 ? '(' + CurrencyFormat(stateDataFooter?.selisihAlokasiDana * -1) + ')' : CurrencyFormat(stateDataFooter?.selisihAlokasiDana)}</b>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateFooter;
