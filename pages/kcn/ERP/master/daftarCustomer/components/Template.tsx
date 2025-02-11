import { faBarcode, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FieldProps, JamOpsProps } from '../functions/definition';

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    change: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    isRed?: boolean;
}

export const contentLoader = () => {
    return (
        // prettier-ignore
        <div className="screen_loader animate__animated flex justify-center items-center fixed inset-0 z-[60] place-content-center bg-[#ffffff00] dark:bg-[#060818]">
            <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 67 67"
                        to="-360 67 67"
                        dur="2.5s"
                        repeatCount="indefinite"
                    />
                </path>
                <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                    <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                </path>
            </svg>
        </div>
    );
};

export const CheckboxCustomerCustom: React.FC<CheckboxProps> = ({ id, label, checked, change, name, isRed }) => {
    return (
        <div className="e-checkbox-wrapper e-wrapper">
            <label htmlFor={id}>
                <input id={id} className="e-control e-checkbox e-lib" type="checkbox" name={name} checked={checked} onChange={change} />
                <span className={`e-ripple-container ${checked ? 'e-ripple-check' : ''}`} data-ripple="true" />
                <span className={`e-icons e-frame ${checked ? 'e-check' : ''}`} />
                <span className={`e-label ${isRed ? '' : '!text-red-600'}`}>{label}</span>
            </label>
        </div>
    );
};
export const statusTokoArray = [
    { label: 'Keluarga', value: 'Keluarga' },
    { label: 'Sendiri', value: 'Sendiri' },
    { label: 'Sewa', value: 'Sewa' },
    { label: 'Lainnya', value: 'Lainnya' },
];
export const statusRumah = [
    { label: 'Keluarga', value: 'Keluarga' },
    { label: 'Sendiri', value: 'Sendiri' },
    { label: 'Sewa', value: 'Sewa' },
    { label: 'Lainnya', value: 'Lainnya' },
];
export const jenisKelaminArray = [
    { label: 'Laki-laki', value: 'Laki-laki' },
    { label: 'Perempuan', value: 'Perempuan' },
];
export const diHubunginArray = [
    {
        label: 'Telepon Dan WhatsApp',
        value: 'A',
    },
    {
        label: 'Telepon',
        value: 'T',
    },
    {
        label: 'WhatsApp',
        value: 'W',
    },
    {
        label: 'Tidak Berkenan Dihubungi',
        value: 'N',
    },
];
export const iPTabValue = [
    {
        id: 1,
        label: 'Alamat Pemilik',
        name: 'alamat_pemilik1',
        type: 'string',
        value: '',
        readOnly: false,
    },
    {
        id: 2,
        name: 'alamat_pemilik2',
        label: '',
        type: 'string',
        value: '',
        readOnly: false,
    },
    {
        id: 3,
        name: 'kota_pemilik',
        label: 'Kota',
        type: 'select',
        value: '',
        readOnly: false,
    },
    {
        id: 4,
        name: 'kodepos_pemilik',
        label: 'Kode Pos',
        type: 'number',
        value: '',
        readOnly: false,
    },
    {
        id: 5,
        name: 'kecamatan_pemilik',
        label: 'Kecamatan',
        type: 'select',
        value: '',
        readOnly: false,
    },
    {
        id: 6,
        name: 'propinsi_pemilik',
        label: 'Provinsi',
        type: 'select',
        value: '',
        readOnly: false,
    },
    {
        id: 7,
        name: 'kelurahan_pemilik',
        label: 'Kelurahan',
        type: 'select',
        value: '',
        readOnly: false,
    },
    {
        id: 8,
        name: 'negara_pemilik',
        label: 'Negara',
        type: 'select',
        value: '',
        readOnly: false,
    },
    {
        id: 9,
        name: 'status_rumah',
        label: 'Status Rumah Tinggal',
        type: 'select',
        value: '',
        readOnly: false,
        selection: statusRumah,
    },
    {
        id: 10,
        name: 'tinggal_sejak',
        label: 'Tinggal Sejak',
        type: 'number',
        value: '',
        readOnly: false,
    },
    {
        id: 11,
        name: 'personal',
        label: 'Nama Pemilik',
        type: 'personalString',
        value: '',
        readOnly: true,
    },
    {
        id: 12,
        name: 'tempat_lahir',
        label: 'Tempat Lahir',
        type: 'ttl',
        value: '',
        readOnly: false,
    },
    {
        id: 13,
        name: 'tanggal_lahir',
        label: 'Tanggal Lahir',
        type: 'ttlDate',
        value: '',
        readOnly: false,
    },
    {
        id: 14,
        name: 'jenis_kelamin',
        label: 'Jenis Kelamin',
        type: 'select',
        value: '',
        readOnly: false,
        selection: jenisKelaminArray,
    },
    {
        id: 15,
        name: 'space',
        label: 'Space',
        type: 'space',
        value: '',
        readOnly: true,
    },
    {
        id: 16,
        name: 'status_perkawinan',
        label: 'Status Perkawinan',
        type: 'string',
        value: '',
        readOnly: false,
    },
    {
        id: 17,
        name: 'warganegara',
        label: 'Warga Negara',
        type: 'string',
        value: '',
        readOnly: false,
    },
    {
        id: 18,
        name: 'ktp',
        label: 'No. KTP / Paspor',
        type: 'string',
        value: '',
        readOnly: true,
    },
    {
        id: 19,
        name: 'sim',
        label: 'No. SIM',
        type: 'number',
        value: '',
        readOnly: true,
    },
    {
        id: 20,
        name: 'telp',
        label: 'Telepon 1',
        type: 'number',
        value: '',
        readOnly: true,
    },
    {
        id: 21,
        name: 'telp2',
        label: 'Telepon 2',
        type: 'number',
        value: '',
        readOnly: true,
    },
    {
        id: 22,
        name: 'hp',
        label: 'Handphone',
        type: 'number',
        value: '',
        readOnly: true,
    },
    {
        id: 23,
        name: 'hp2',
        label: 'WhatsApp',
        type: 'number',
        value: '',
        readOnly: true,
    },
    {
        id: 24,
        name: 'fax',
        label: 'Facimile',
        type: 'number',
        value: '',
        readOnly: true,
    },
    {
        id: 25,
        name: 'space',
        label: 'Space',
        type: 'space',
        value: '',
        readOnly: true,
    },
    {
        id: 26,
        name: 'email',
        label: 'Email',
        type: 'action',
        value: '',
        readOnly: true,
        isAction: true,
        icon: (props: any) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                {...props}
                viewBox="0 0 24 24"
            >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
        ),
        hint: 'Kirimkan Email',
    },
    {
        id: 27,
        name: 'website',
        label: 'Website',
        type: 'action',
        value: '',
        readOnly: true,
        isAction: true,
        icon: (props: any) => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                {...props}
            >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
        ),

        hint: 'Kunjungi Website',
    },
    {
        id: 28,
        name: 'dikontak',
        label: 'Kontak aktif yang bisa dihubungi',
        type: 'select',
        value: '',
        readOnly: false,
        selection: diHubunginArray,
    },
];
export const dKTabValue = [
    {
        kode_relasi: '',
        id_relasi: '',
        nama_lengkap: '',
        nama_person: '',
        jab: '',
        hubungan: '',
        bisnis: '',
        bisnis2: '',
        telp: '',
        hp: '',
        hp2: '',
        fax: '',
        email: '',
        catatan: '',
        file_kuasa: '',
        file_ktp: '',
        file_ttd: '',
        aktif_kontak: '',
    },
];
export const JamOpsField: JamOpsProps[] = [
    { id: 1, Hari: 'Senin', JamBuka: '', JamTutup: '', Buka: false },
    { id: 2, Hari: 'Selasa', JamBuka: '', JamTutup: '', Buka: false },
    { id: 3, Hari: 'Rabu', JamBuka: '', JamTutup: '', Buka: false },
    { id: 4, Hari: 'Kamis', JamBuka: '', JamTutup: '', Buka: false },
    { id: 5, Hari: 'Jum`at', JamBuka: '', JamTutup: '', Buka: false },
    { id: 6, Hari: 'Sabtu', JamBuka: '', JamTutup: '', Buka: false },
    { id: 7, Hari: 'Minggu', JamBuka: '', JamTutup: '', Buka: false },
];
let id: number = 1;
export const BaseFormField: FieldProps[] = [
    { id: id++, FieldName: 'kode_cust', Label: '', Type: 'string', Value: '', TabId: 0, ReadOnly: true, IsAction: false, group: 'masterTop', Visible: false },
    { id: id++, FieldName: 'kode_relasi', Label: 'No. Register', Type: 'string', Value: '', TabId: 0, ReadOnly: true, IsAction: false, group: 'masterTop', Visible: true },
    { id: id++, FieldName: 'nama_relasi', Label: 'Nama', Type: 'string', Value: '', TabId: 0, ReadOnly: true, IsAction: true, group: 'masterTop', Visible: true },
    { id: id++, FieldName: 'no_cust', Label: 'No. Customer', Type: 'string', Value: '', TabId: 0, ReadOnly: true, IsAction: true, group: 'masterTop', Visible: true },
    { id: id++, FieldName: 'prospek', Label: 'Prospektif', Type: 'checkbox', Value: true, TabId: 0, ReadOnly: false, IsAction: false, group: 'masterTop', Visible: true },
    { id: id++, FieldName: 'aktif', Label: 'Non-Aktif', Type: 'checkbox', Value: false, TabId: 0, ReadOnly: false, IsAction: false, group: 'masterTop', Visible: true },
    {
        id: id++,
        FieldName: 'terima_dokumen',
        Label: 'Terima Dokumen Asli (Kantor Pusat)',
        Type: 'checkbox',
        Value: false,
        TabId: 0,
        ReadOnly: false,
        IsAction: false,
        group: 'masterTop',
        Visible: true,
    },
    { id: id++, FieldName: 'manual_hks_mobile', Label: 'Manual HKS Mobile', Type: 'checkbox', Value: false, TabId: 0, ReadOnly: false, IsAction: false, group: 'masterTop', Visible: true },
    { id: id++, FieldName: 'pabrik', Label: 'Pabrik', Type: 'checkbox', Value: false, TabId: 0, ReadOnly: false, IsAction: false, group: 'masterTop', Visible: true },
    // TABID 1
    { id: id++, FieldName: 'tgl_register', Label: 'Tanggal Register', Type: 'date', Value: new Date(), TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'tgl_cust', Label: 'Tanggal NOO', Type: 'date', Value: new Date(), TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'alamat', Label: 'Alamat', Type: 'longString', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'alamat2', Label: '', Type: 'longString', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'telp_toko', Label: 'No. Telp', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: '', Label: '', Type: 'space', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'kota', Label: 'Kota', Type: 'string', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'kodepos', Label: 'Kode Pos', Type: 'number', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'kecamatan', Label: 'Kecamatan', Type: 'string', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'propinsi', Label: 'Provinsi', Type: 'string', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'kelurahan', Label: 'Kelurahan', Type: 'string', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'negara', Label: 'Negara', Type: 'string', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'npwp', Label: 'No. NPWP', Type: 'number', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'siup', Label: 'No. SIUP', Type: 'number', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'luas_toko', Label: 'Luas Kantor / Outlet (M2)', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'luas_gudang', Label: 'Luas Gudang', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'status_toko', Label: 'Status Kantor / Outlet', Type: 'select', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'usaha_sejak', Label: 'Berdiri Sejak Tahun', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'jumlah_karyawan', Label: 'Jumlah Karyawan', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: '', Label: '', Type: 'space', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'jarak_dari_gudang', Label: 'Jarak Dari Gudang (KM)', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: '', Label: '', Type: 'space', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'omzet', Label: 'Perkiraan Omzet / Bulan Rp', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: '', Label: '', Type: 'space', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'jenis_usahalain', Label: 'Jenis Usaha Lain', Type: 'longString', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'usahalain_sejak', Label: 'Usaha Lain Berdiri Sejak', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'hari_kunjungan', Label: 'Hari Kunjungan', Type: 'string', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    {
        id: id++,
        FieldName: 'jenis_bayar',
        Label: 'Jenis Pembayaran',
        Type: 'checkbox',
        Value: '',
        TabId: 1,
        ReadOnly: false,
        IsAction: false,
        group: 'detail',
        Visible: true,
        Items: [
            { id: 1, FieldName: 'bayar_transfer', Value: false, Label: 'Transfer' },
            { id: 2, FieldName: 'bayar_giro', Value: false, Label: 'BG/Cek' },
            { id: 3, FieldName: 'bayar_tunai', Value: false, Label: 'Titip Tunai' },
        ],
    },
    {
        id: id++,
        FieldName: 'jenis_order',
        Label: 'Jenis Order',
        Type: 'checkbox',
        Value: '',
        TabId: 1,
        ReadOnly: false,
        IsAction: false,
        group: 'detail',
        Visible: true,
        Items: [
            { id: 1, FieldName: 'order_cbd', Value: false, Label: 'CBD' },
            { id: 2, FieldName: 'order_cod', Value: false, Label: 'COD' },
            { id: 3, FieldName: 'order_kredit', Value: false, Label: 'Kredit' },
        ],
    },
    { id: id++, FieldName: 'jam_ops', Label: 'Hari / Jam Operasional', Type: 'Grid', Value: '', TabId: 1, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
];

const Template = () => {
    return <div>Template</div>;
};
export default Template;

// TODO: ini Jangan Lupa
// quCustalamat_kirim1.value:= quViewalamat.AsString;
// quCustalamat_kirim2.value:= quViewalamat2.AsString;
// quCustkota_kirim.value:= quViewkota.AsString;
// quCustpropinsi_kirim.value:= quViewpropinsi.AsString;
// quCustnegara_kirim.value:= quViewnegara.AsString;
