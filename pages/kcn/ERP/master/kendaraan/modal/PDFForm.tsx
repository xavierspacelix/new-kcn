import { useEffect, useState } from 'react';
import { base64ToBlob } from '../../../fa/posting-ttp/functional/fungsiForm';

interface PDFFormInterface {
    pdfIndex: any;
    uploadedFiles: any;
    setUploadedFiles: any;
    masterState: string;
}

const PDFForm = ({ pdfIndex, uploadedFiles = [], setUploadedFiles,masterState }: PDFFormInterface) => {
    const [pdfFile, setPdfFile] = useState<File | null | any>(null);
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);

    useEffect(() => {
      if(masterState === "EDIT" && uploadedFiles[pdfIndex]?.fileUrl !== null) {
        const renamedFileTemp = uploadedFiles[pdfIndex] || {};
        
        
        const renamedFile = new File([renamedFileTemp?.fileUrl], renamedFileTemp?.file?.name, { type: renamedFileTemp?.file?.type });
        console.log("renamedFile pdf",renamedFile);

    //
                const reader = new FileReader();
                reader.readAsDataURL(renamedFile);
        
                setPdfFile(renamedFile);
                const fileURL = URL.createObjectURL(renamedFile);
                const base64Data = renamedFileTemp?.fileUrl; // Ganti dengan data Base64 Anda
const blob = base64ToBlob(base64Data.split(',')[1],renamedFileTemp?.file?.type);
const blobUrl = URL.createObjectURL(blob);
                setPdfPreview(blobUrl);
                
      } 
    },[uploadedFiles[pdfIndex]])

    // Fungsi untuk menangani upload file
    const handleFileChange = async (event: { target: { files: any[] } } | any) => {
        const file = event.target.files?.[0];
        if (file && file.type.includes('pdf')) {
            const file = event.target.files[0];
            if (file) {
                // Generate a datetime string
                const now = new Date();
                const year = now.getFullYear().toString().slice(-2); // Last 2 digits of the year
                const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');

                const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;

                // Create a new file name with the datetime string and original file extension
                const extension = file.name.split('.').pop();
                const newFileName = `${dateTimeString}.${extension}`;

                // Use a File constructor to create a new file object with the new name
                const renamedFile = new File([file], 'NP' + newFileName, { type: file.type });

                const reader = new FileReader();
                reader.readAsDataURL(renamedFile);

                setPdfFile(renamedFile);
                const fileURL = URL.createObjectURL(renamedFile);
                setPdfPreview(fileURL);
                reader.onloadend = () => {
                    const temp = uploadedFiles;
                    temp[parseInt(pdfIndex)] = { file: renamedFile, fileUrl: reader.result as string, tabIndex: parseInt(pdfIndex) };

                    console.log('Upload file hapus : ', temp);
                    setUploadedFiles(temp);
                };
            }
        } else {
            alert('Please upload a JPG file.');
        }
    };

    // Fungsi untuk menghapus file
    const handleRemoveFile = () => {
        setPdfFile(null);
        setPdfPreview(null);
    };

    // Fungsi untuk menyimpan file (simulasi)
    const handleSaveFile = () => {
        if (pdfFile) {
            alert(`File "${pdfFile?.name}" berhasil disimpan!`);
        } else {
            alert('Tidak ada file yang dipilih.');
        }
    };

    return (
        <div className="rounded-md bg-gray-100 p-4 text-xs shadow-md">
            <label className="mb-2 block text-xs font-medium text-gray-700">Portable Document File (PDF):</label>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mb-4 block w-full text-xs text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
            />
            {pdfFile && (
                <div className="mb-4">
                    <p className="text-xs text-gray-700">File: {pdfFile.name}</p>
                </div>
            )}
            <div className="flex gap-2">
                <button
                    onClick={handleRemoveFile}
                    className="text-xm rounded border border-gray-400 bg-gray-200 px-2 py-1 font-semibold text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Hapus File
                </button>
                <button
                    onClick={handleSaveFile}
                    className="text-xm rounded border border-gray-400 bg-gray-200 px-2 py-1 font-semibold text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Simpan ke File
                </button>
                {pdfPreview && (
                    <a
                        href={pdfPreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xm rounded border border-gray-400 bg-gray-200 px-2 py-1 font-semibold text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Preview
                    </a>
                )}
            </div>
        </div>
    );
};

export default PDFForm;
