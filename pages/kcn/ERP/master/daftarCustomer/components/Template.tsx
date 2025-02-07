import { faBarcode, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

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
const statusTokoArray = [
    { label: 'Keluarga', value: 'Keluarga' },
    { label: 'Sendiri', value: 'Sendiri' },
    { label: 'Sewa', value: 'Sewa' },
    { label: 'Lainnya', value: 'Lainnya' },
];
const statusRumah = [
    { label: 'Keluarga', value: 'Keluarga' },
    { label: 'Sendiri', value: 'Sendiri' },
    { label: 'Sewa', value: 'Sewa' },
    { label: 'Lainnya', value: 'Lainnya' },
];
const jenisKelaminArray = [
    { label: 'Laki-laki', value: 'Laki-laki' },
    { label: 'Perempuan', value: 'Perempuan' },
];
const diHubunginArray = [
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
export const defaultValueIuTab = [
    {
        id: 1,
        type: 'date',
        format: '',
        name: 'tgl_register',
        label: 'Tanggal Register',
        value: new Date(),
        hint: <span className="text-xs text-[#5EA7FF]">*ditetapkan otomatis pada saat pengisian data customer</span>,
        placeholder: 'Tanggal Register',
        group: 'left',
        team: 'master',
    },
    {
        id: 2,
        type: 'date',
        format: '',
        name: 'tgl_cust',
        label: 'Tanggal NOO',
        value: new Date(),
        hint: <span className="text-xs text-[#5EA7FF]">*ditetapkan otomatis pada saat pengisian plafond pertama kalinya</span>,
        placeholder: 'Tanggal NOO',
        group: 'left',
        team: 'master',
    },
    {
        id: 3,
        type: 'stringAlamat',
        format: '',
        name: 'alamat',
        label: 'Alamat',
        value: '',
        hint: null,
        placeholder: 'Alamat',
        group: 'left',
        team: 'master',
    },
    {
        id: 4,
        type: 'stringAlamat',
        format: '',
        name: 'alamat2',
        label: '',
        value: '',
        hint: null,
        placeholder: '',
        group: 'left',
        team: 'master',
    },
    {
        id: 5,
        type: 'number',
        format: 'telp',
        name: 'telp_toko',
        label: 'No. Telp',
        value: '',
        hint: null,
        placeholder: 'No. Telp',
        group: 'left',
        team: 'detail',
    },
    {
        id: 6,
        type: 'space',
        format: 'space',
        name: 'space',
        label: 'Space',
        value: '',
        hint: null,
        placeholder: 'Space',
        group: 'left',
        team: 'detail',
    },
    {
        id: 7,
        type: 'string',
        format: 'text',
        name: 'kota',
        label: 'Kota',
        value: '',
        hint: null,
        placeholder: 'Kota',
        readonly: true,
        group: 'left',
        team: 'master',
    },
    {
        id: 8,
        type: 'number',
        format: 'kode_pos',
        name: 'kodepos',
        label: 'Kode Pos',
        value: '',
        hint: null,
        placeholder: 'Kode Pos',
        readonly: true,
        group: 'left',
        team: 'master',
    },
    {
        id: 9,
        type: 'string',
        format: 'text',
        name: 'kecamatan',
        label: 'Kecamatan',
        value: '',
        hint: null,
        placeholder: 'Kecamatan',
        readonly: true,
        group: 'left',
        team: 'master',
    },
    {
        id: 10,
        type: 'string',
        format: 'text',
        name: 'kelurahan',
        label: 'Kelurahan',
        value: '',
        hint: null,
        placeholder: 'Kelurahan',
        readonly: true,
        group: 'left',
        team: 'master',
    },
    {
        id: 11,
        type: 'string',
        format: 'text',
        name: 'propinsi',
        label: 'Provinsi',
        value: '',
        hint: null,
        placeholder: 'Provinsi',
        readonly: true,
        group: 'left',
        team: 'master',
    },
    {
        id: 12,
        type: 'string',
        format: 'text',
        name: 'negara',
        label: 'Negara',
        value: '',
        hint: null,
        placeholder: 'Negara',
        readonly: true,
        group: 'left',
        team: 'master',
    },
    {
        id: 13,
        type: 'number',
        format: 'npwp',
        name: 'npwp',
        label: 'No. NPWP',
        value: '',
        hint: null,
        placeholder: 'No. NPWP',
        readonly: true,
        group: 'left',
        team: 'master',
    },
    {
        id: 14,
        type: 'string',
        format: 'text',
        name: 'siup',
        label: 'No. SIUP',
        value: '',
        hint: null,
        placeholder: 'No. SIUP',
        readonly: true,
        group: 'left',
        team: 'master',
    },
    {
        id: 15,
        type: 'number',
        format: 'm2',
        name: 'luas_toko',
        label: 'Luas Kantor / Outlet (M2)',
        value: '',
        hint: null,
        placeholder: 'Luas Toko',
        readonly: false,
        group: 'left',
        team: 'detail',
    },
    {
        id: 16,
        type: 'number',
        format: 'm2',
        name: 'luas_gudang',
        label: 'Luas Gudang',
        value: '',
        hint: null,
        placeholder: 'Luas Gudang',
        readonly: false,
        group: 'left',
        team: 'detail',
    },
    {
        id: 17,
        type: 'select',
        format: 'select',
        name: 'status_toko',
        label: 'Status Toko / Outlet',
        value: '',
        hint: null,
        placeholder: 'Pilih Status Toko',
        readonly: false,
        selection: statusTokoArray,
        group: 'left',
        team: 'detail',
    },
    {
        id: 18,
        type: 'number',
        format: 'year',
        name: 'usaha_sejak',
        label: 'Usaha Sejak',
        value: '',
        hint: null,
        placeholder: 'Usaha Sejak',
        group: 'left',
        team: 'detail',
    },
    {
        id: 19,
        type: 'number',
        format: 'number',
        name: 'jumlah_karyawan',
        label: 'Jumlah Karyawan',
        value: '',
        hint: null,
        placeholder: 'Jumlah Karyawan',
        group: 'left',
        team: 'detail',
    },
    {
        id: 20,
        type: 'number',
        format: 'number',
        name: 'jarak_dari_gudang',
        label: 'Jarak Dari Gudang (KM)',
        value: '',
        hint: null,
        placeholder: 'Jarak Dari Gudang (KM)',
        group: 'left',
        team: 'detail',
    },
    {
        id: 21,
        type: 'number',
        format: 'number',
        name: 'omzet',
        label: 'Perkiraan Omzet / Bulan Rp',
        value: '',
        hint: null,
        placeholder: 'Perkiraan Omzet / Bulan Rp',
        group: 'left',
        team: 'detail',
    },
    {
        id: 22,
        type: 'space',
        format: 'space',
        name: 'space',
        label: 'Space',
        value: '',
        hint: null,
        placeholder: 'Space',
        group: 'left',
        team: 'detail',
    },
    {
        id: 23,
        type: 'stringJenisUsaha',
        format: '',
        name: 'jenis_usahalain',
        label: 'Jenis Usaha Lain',
        value: '',
        hint: null,
        placeholder: 'Jenis Usaha Lain',
        group: 'left',
        team: 'detail',
    },
    {
        id: 24,
        type: 'number',
        format: 'number',
        name: 'usahalain_sejak',
        label: 'Usaha Lain Berdiri Sejak',
        value: '',
        hint: null,
        placeholder: 'Usaha Lain Berdiri Sejak',
        group: 'left',
        team: 'detail',
    },
    {
        id: 25,
        type: 'number',
        format: 'number',
        name: 'hari_kunjungan',
        label: 'Hari Kunjungan',
        value: '',
        hint: null,
        placeholder: 'Hari Kunjungan',
        group: 'left',
        team: 'detail',
    },
    {
        id: 26,
        type: 'radio',
        format: 'radio',
        name: 'jenis_pembayaran',
        label: 'Jenis Pembayaran',
        value: '',
        hint: null,
        placeholder: 'Jenis Pembayaran',
        selection: [
            {
                name: 'bayar_transfer',
                label: 'Transfer',
                value: false,
            },
            { name: 'bayar_giro', label: 'BG/Cek', value: false },
            { name: 'bayar_tunai', label: 'Titip Tunai', value: false },
        ],
        group: 'left',
        team: 'detail',
    },
    {
        id: 27,
        type: 'radio',
        format: 'radio',
        name: 'jenis_order',
        label: 'Jenis Order',
        value: '',
        hint: null,
        placeholder: 'Jenis Order',
        selection: [
            {
                name: 'order_cbd',
                label: 'CBD',
                value: false,
            },
            { name: 'order_cod', label: 'COD', value: false },
            { name: 'order_kredit', label: 'Kredit', value: false },
        ],
        group: 'left',
        team: 'detail',
    },
    {
        id: 28,
        type: 'table',
        format: 'table',
        name: 'jam_operasional',
        label: 'Hari / Jam Operasional',
        value: '',
        hint: null,
        placeholder: 'Hari / Jam Operasional',
        items: [
            { id: 1, hari: 'Senin', jam_buka: '', jam_tutup: '', buka: false },
            { id: 2, hari: 'Selasa', jam_buka: '', jam_tutup: '', buka: false },
            { id: 3, hari: 'Rabu', jam_buka: '', jam_tutup: '', buka: false },
            { id: 4, hari: 'Kamis', jam_buka: '', jam_tutup: '', buka: false },
            { id: 5, hari: 'Jum`at', jam_buka: '', jam_tutup: '', buka: false },
            { id: 6, hari: 'Sabtu', jam_buka: '', jam_tutup: '', buka: false },
            { id: 7, hari: 'Minggu', jam_buka: '', jam_tutup: '', buka: false },
        ],
        group: 'right',
        team: 'jam_ops',
    },
    {
        id: 29,
        type: 'textarea',
        format: 'textarea',
        name: 'alasan',
        label: 'Alasan Blacklist / Open Blacklist / NOO Batal / Tidak Digarap',
        value: '',
        hint: null,
        placeholder: 'Alasan Blacklist / Open Blacklist / NOO Batal / Tidak Digarap',
        group: 'right',
        team: 'master',
    },
];
export const headerFieldValue = [
    {
        name: 'kode_relasi',
        placeholder: 'No. Register',
        value: '',
        type: 'number',
        options: null,
        selection: [],
        hint: null,
        disabled: true,
        action: {
            isAction: false,
            icon: null,
        },
        checked: false,
        team: 'master',
    },
    {
        name: 'nama_relasi',
        placeholder: 'Nama',
        value: '',
        type: 'text',
        options: null,
        selection: [],
        hint: null,
        disabled: true,
        action: {
            isAction: true,
            icon: faMagnifyingGlass,
        },
        checked: false,
        team: 'master',
    },
    {
        name: 'no_cust',
        placeholder: 'No. Customer',
        value: '',
        type: 'number',
        options: null,
        selection: [],
        hint: null,
        disabled: true,
        action: {
            isAction: true,
            icon: faBarcode,
        },
        checked: false,
        team: 'master',
    },
    {
        name: 'prospek',
        placeholder: 'Prospek',
        value: '',
        type: 'checkbox',
        options: null,
        selection: [],
        hint: null,
        disabled: true,
        action: {
            isAction: false,
            icon: null,
        },
        checked: true,
        team: 'master',
    },
    {
        name: 'aktif',
        placeholder: 'Non-Aktif',
        value: '',
        type: 'checkbox',
        options: null,
        selection: [],
        hint: null,
        disabled: true,
        action: {
            isAction: false,
            icon: null,
        },
        checked: false,
        team: 'master',
    },
    {
        name: 'terima_dokumen',
        placeholder: 'Terima Dokumen Asli (Kantor Pusat)',
        value: '',
        type: 'checkbox',
        options: null,
        selection: [],
        hint: null,
        disabled: true,
        action: {
            isAction: false,
            icon: null,
        },
        checked: false,
        team: 'master',
    },
    {
        name: 'manual_hks_mobile',
        placeholder: 'Manual HKS Mobile',
        value: '',
        type: 'checkbox',
        options: null,
        selection: [],
        hint: null,
        disabled: true,
        action: {
            isAction: false,
            icon: null,
        },
        checked: false,
        team: 'master',
    },
    {
        name: 'pabrik',
        placeholder: 'Pabrik',
        value: '',
        type: 'checkbox',
        options: null,
        selection: [],
        hint: null,
        disabled: true,
        action: {
            isAction: false,
            icon: null,
        },
        checked: false,
        team: 'master',
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
const Template = () => {
    return <div>Template</div>;
};

export default Template;
