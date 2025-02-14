import { faBarcode, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FieldDKProps, FieldProps, JamOpsProps, PotensiaProdukProps } from '../functions/definition';

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
export const statusPerkawinanArray = [
    {
        label: 'Menikah',
        value: 'Menikah',
    },
    {
        label: 'Belum Menikah',
        value: 'Belum Menikah',
    },
    {
        label: 'Duda / Janda',
        value: 'Duda / Janda',
    },
];

export const dKTabValue = {
    kode_relasi: '',
    id_relasi: 0,
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
    aktif_kontak: true,
};
export type dKTabInterface = {
    kode_relasi: string;
    id_relasi: number;
    nama_lengkap: string;
    nama_person: string;
    jab: string;
    hubungan: string;
    bisnis: string;
    bisnis2: string;
    telp: string;
    hp: string;
    hp2: string;
    fax: string;
    email: string;
    catatan: string;
    file_kuasa: string;
    file_ktp: string;
    file_ttd: string;
    aktif_kontak: boolean;
};
export const JamOpsField: JamOpsProps[] = [
    { id: 1, Hari: 'Senin', JamBuka: '', JamTutup: '', Buka: false },
    { id: 2, Hari: 'Selasa', JamBuka: '', JamTutup: '', Buka: false },
    { id: 3, Hari: 'Rabu', JamBuka: '', JamTutup: '', Buka: false },
    { id: 4, Hari: 'Kamis', JamBuka: '', JamTutup: '', Buka: false },
    { id: 5, Hari: 'Jum`at', JamBuka: '', JamTutup: '', Buka: false },
    { id: 6, Hari: 'Sabtu', JamBuka: '', JamTutup: '', Buka: false },
    { id: 7, Hari: 'Minggu', JamBuka: '', JamTutup: '', Buka: false },
];

export const PotensialProdukField: PotensiaProdukProps[] = [
    {
        kode_cust: '',
        kategori: '',
        kelompok: '',
        catatan: '',
    },
]
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
    { id: id++, FieldName: 'tgl_register', Label: 'Tanggal Register', Type: 'date', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
    { id: id++, FieldName: 'tgl_cust', Label: 'Tanggal NOO', Type: 'date', Value: '', TabId: 1, ReadOnly: true, IsAction: false, group: 'masterLeft', Visible: true },
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
    {
        id: id++,
        FieldName: 'alasan',
        Label: 'Alasan BlackList / Open Blacklist / NOO Batal / Tidak digarap',
        Type: 'textarea',
        Value: '',
        TabId: 1,
        ReadOnly: true,
        IsAction: false,
        group: 'masterRight',
        Visible: true,
    },
    // Info Pemilik TabID 2
    { id: id++, FieldName: 'alamat_pemilik', Label: 'Alamat Pemilik', Type: 'longString', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'alamat_pemilik2', Label: '', Type: 'longString', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'kota_pemilik', Label: 'Kota', Type: 'select', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'kodepos_pemilik', Label: 'Kode Pos', Type: 'number', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'kecamatan_pemilik', Label: 'Kecamatan', Type: 'select', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'propinsi_pemilik', Label: 'Provinsi', Type: 'select', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'kelurahan_pemilik', Label: 'Kelurahan', Type: 'select', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'negara_pemilik', Label: '', Type: 'select', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'status_rumah', Label: 'Status Rumah Tinggal', Type: 'select', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'tinggal_sejak', Label: 'Tinggal Sejak', Type: 'number', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'personal', Label: 'Nama Pemilik', Type: 'longString', Value: '', TabId: 2, ReadOnly: true, IsAction: false, group: 'master', Visible: true },
    { id: id++, FieldName: 'tempat_lahir', Label: 'Tempat/Tanggal Lahir', Type: 'string', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'tanggal_lahir', Label: '', Type: 'date', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'jenis_kelamin', Label: 'Jenis Kelamin', Type: 'select', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: '', Label: '', Type: 'space', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'status_perkawinan', Label: 'Status Perkawinan', Type: 'select', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'warganegara', Label: 'Warga Negara', Type: 'string', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'ktp', Label: 'No. KTP / Paspor', Type: 'number', Value: '', TabId: 2, ReadOnly: true, IsAction: false, group: 'master', Visible: true },
    { id: id++, FieldName: 'sim', Label: 'No. SIM', Type: 'number', Value: '', TabId: 2, ReadOnly: true, IsAction: false, group: 'master', Visible: true },
    { id: id++, FieldName: 'telp', Label: 'Telepon 1', Type: 'number', Value: '', TabId: 2, ReadOnly: true, IsAction: false, group: 'master', Visible: true },
    { id: id++, FieldName: 'telp2', Label: 'Telepon 2', Type: 'number', Value: '', TabId: 2, ReadOnly: true, IsAction: false, group: 'master', Visible: true },
    { id: id++, FieldName: 'hp', Label: 'Handphone', Type: 'number', Value: '', TabId: 2, ReadOnly: true, IsAction: false, group: 'master', Visible: true },
    { id: id++, FieldName: 'hp2', Label: 'WhatsApp', Type: 'number', Value: '', TabId: 2, ReadOnly: true, IsAction: false, group: 'master', Visible: true },
    { id: id++, FieldName: 'fax', Label: 'Facimile', Type: 'number', Value: '', TabId: 2, ReadOnly: true, IsAction: false, group: 'master', Visible: true },
    { id: id++, FieldName: '', Label: '', Type: 'space', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: 'email', Label: 'Email', Type: 'longString', Value: '', TabId: 2, ReadOnly: true, IsAction: true, group: 'master', Visible: true },
    { id: id++, FieldName: 'website', Label: 'Website', Type: 'longString', Value: '', TabId: 2, ReadOnly: true, IsAction: true, group: 'master', Visible: true },
    { id: id++, FieldName: 'dikontak', Label: 'Kontak Aktif Yang Bisa di Hubungi', Type: 'select', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
    { id: id++, FieldName: '', Label: '', Type: 'space', Value: '', TabId: 2, ReadOnly: false, IsAction: false, group: 'detail', Visible: true },
];
export const baseFormDKField: FieldDKProps[] = [
    { id: 1, FieldName: 'nama_lengkap', Type: 'string', Value: '', TabId: 0, ReadOnly: false, IsAction: false, Visible: false, Label: 'Nama' },
    { id: 2, FieldName: 'nama_person', Type: 'string', Value: '', TabId: 0, ReadOnly: false, IsAction: false, Visible: false, Label: 'Panggilan' },
    { id: 3, FieldName: 'aktif_kontak', Type: 'checkbox', Value: false, TabId: 0, ReadOnly: false, IsAction: false, Visible: false, Label: 'Non Aktif' },
    { id: 4, FieldName: 'jab', Type: 'select', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: 'Jabatan' },
    { id: 5, FieldName: 'hubungan', Type: 'select', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: 'Hubungan Kepemilikan' },
    { id: 6, FieldName: 'bisnis', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: 'Telp. Kantor 1' },
    { id: 7, FieldName: 'hp', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: 'Handphone' },
    { id: 8, FieldName: 'bisnis2', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: 'Telp. Kantor 2' },
    { id: 9, FieldName: 'hp2', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: 'WhatsApp' },
    { id: 10, FieldName: 'telp', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: 'Telp. Rumah' },
    { id: 11, FieldName: '', Type: 'space', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: '' },
    { id: 12, FieldName: 'fax', Type: 'number', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: 'Facimile' },
    { id: 13, FieldName: '', Type: 'space', Value: '', TabId: 1, ReadOnly: false, IsAction: false, Visible: false, Label: '' },
    { id: 14, FieldName: 'email', Type: 'longString', Value: '', TabId: 1, ReadOnly: false, IsAction: true, Visible: false, Label: 'Email' },
    { id: 15, FieldName: 'catatan', Type: 'string', Value: '', TabId: 2, ReadOnly: false, IsAction: true, Visible: false, Label: '' },
];
export const headertext = [
    { id: 1, text: '1. Informasi' },
    { id: 2, text: '2. Catatan' },
];
export const jabatanArray = [
    { label: 'Anggota keluarga pemilik', value: 'Anggota keluarga pemilik' },
    { label: 'Manager keuangan', value: 'Manager keuangan' },
    { label: 'Manager pembelian', value: 'Manager pembelian' },
    { label: 'Admin keuangan', value: 'Admin keuangan' },
    { label: 'Admin pembelian', value: 'Admin pembelian' },
    { label: 'Karyawan toko', value: 'Karyawan toko' },
    { label: 'Lainnya', value: 'Lainnya' },
];
export const hubArray = [
    { label: 'Pemilik', value: 'Pemilik' },
    { label: 'Suami / istri pemilik', value: 'Suami / istri pemilik' },
    { label: 'Anak pemilik', value: 'Anak pemilik' },
    { label: 'Orang tua pemilik', value: 'Orang tua pemilik' },
    { label: 'Saudara lain', value: 'Saudara lain' },
    { label: 'Orang lain (tidak memiliki hub dengan pemilik)', value: 'Orang lain (tidak memiliki hub dengan pemilik)' },
    { label: 'Lainnya', value: 'Lainnya' },
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
