import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { resExcel, resPdf, resUnknow, resWord, resZip } from '../../../../pages/kcn/ERP/fa/pembayaran-uang-muka/utils/resource';
import axios from 'axios';
import JSZip from 'jszip';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const useUploadFiles2 = (props: any) => {
  const { apiUrl, kode_entitas, statusPage, kode_dokumen } = props;
  const [jsonImageEdit, setJsonImageEdit] = useState([]);
  const [selectedHead, setSelectedHead] = useState('pengajuan-1');
  const [dataFiles, setDataFiles] = useState<any>({
    preview1: '',
    preview2: '',
    preview3: '',
    preview4: '',
    preview5: '',
    preview6: '',
    preview7: '',
    preview8: '',
    preview9: '',
    preview10: '',
    nameImage1: '',
    nameImage2: '',
    nameImage3: '',
    nameImage4: '',
    nameImage5: '',
    nameImage6: '',
    nameImage7: '',
    nameImage8: '',
    nameImage9: '',
    nameImage10: '',
  });

  let uploaderRefPengajuan1: any = useRef<UploaderComponent>(null);
  let uploaderRefPengajuan2: any = useRef<UploaderComponent>(null);
  let uploaderRefPengajuan3: any = useRef<UploaderComponent>(null);
  let uploaderRefPengajuan4: any = useRef<UploaderComponent>(null);
  let uploaderRefPengajuan5: any = useRef<UploaderComponent>(null);
  let uploaderRefPembayaran1: any = useRef<UploaderComponent>(null);
  let uploaderRefPembayaran2: any = useRef<UploaderComponent>(null);
  let uploaderRefPembayaran3: any = useRef<UploaderComponent>(null);
  let uploaderRefPembayaran4: any = useRef<UploaderComponent>(null);
  let uploaderRefPembayaran5: any = useRef<UploaderComponent>(null);

  const updateStateFiles = (field: any, value: any) => {
    setDataFiles((prevState: any) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const imageSrc =
    selectedHead === 'pengajuan-1'
      ? dataFiles?.preview1
      : selectedHead === 'pengajuan-2'
      ? dataFiles?.preview2
      : selectedHead === 'pengajuan-3'
      ? dataFiles?.preview3
      : selectedHead === 'pengajuan-4'
      ? dataFiles?.preview4
      : selectedHead === 'pengajuan-5'
      ? dataFiles?.preview5
      : selectedHead === 'pembayaran-1'
      ? dataFiles?.preview6
      : selectedHead === 'pembayaran-2'
      ? dataFiles?.preview7
      : selectedHead === 'pembayaran-3'
      ? dataFiles?.preview8
      : selectedHead === 'pembayaran-4'
      ? dataFiles?.preview9
      : selectedHead === 'pembayaran-5'
      ? dataFiles?.preview10
      : null;

  const handleFileSelect = (args: any, jenis: any) => {
    const file = args.filesData[0]?.rawFile;
    const fileName = file.name.toLowerCase(); // Ubah nama file ke huruf kecil
    const lastDotIndex = fileName.lastIndexOf('.');
    const fileExtension = fileName.slice(lastDotIndex + 1).toLowerCase();
    // console.log(fileExtension);

    if (jenis === 'pengajuan-1') {
      updateStateFiles('nameImage1', 'FP' + moment().format('YYMMDDHHmmss' + 'Y' + '.' + fileExtension));
    } else if (jenis === 'pengajuan-2') {
      updateStateFiles('nameImage2', 'FP' + moment().format('YYMMDDHHmmss' + 'Y' + '.' + fileExtension));
    } else if (jenis === 'pengajuan-3') {
      updateStateFiles('nameImage3', 'FP' + moment().format('YYMMDDHHmmss' + 'Y' + '.' + fileExtension));
    } else if (jenis === 'pengajuan-4') {
      updateStateFiles('nameImage4', 'FP' + moment().format('YYMMDDHHmmss' + 'Y' + '.' + fileExtension));
    } else if (jenis === 'pengajuan-5') {
      updateStateFiles('nameImage5', 'FP' + moment().format('YYMMDDHHmmss' + 'Y' + '.' + fileExtension));
    } else if (jenis === 'pembayaran-1') {
      updateStateFiles('nameImage6', 'FP' + moment().format('YYMMDDHHmmss' + 'N' + '.' + fileExtension));
    } else if (jenis === 'pembayaran-2') {
      updateStateFiles('nameImage7', 'FP' + moment().format('YYMMDDHHmmss' + 'N' + '.' + fileExtension));
    } else if (jenis === 'pembayaran-3') {
      updateStateFiles('nameImage8', 'FP' + moment().format('YYMMDDHHmmss' + 'N' + '.' + fileExtension));
    } else if (jenis === 'pembayaran-4') {
      updateStateFiles('nameImage9', 'FP' + moment().format('YYMMDDHHmmss' + 'N' + '.' + fileExtension));
    } else if (jenis === 'pembayaran-5') {
      updateStateFiles('nameImage10', 'FP' + moment().format('YYMMDDHHmmss' + 'N' + '.' + fileExtension));
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const IDjenisGambar = document.getElementsByClassName('e-upload-files');
      if (IDjenisGambar.length > 0) {
        if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
          if (jenis === 'pengajuan-1') {
            // setPreview(e.target.result as string);
            updateStateFiles('preview1', e.target.result as string);
            IDjenisGambar[0]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-2') {
            // setPreview2(e.target.result as string);
            updateStateFiles('preview2', e.target.result as string);
            IDjenisGambar[1]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-3') {
            // setPreview3(e.target.result as string);
            updateStateFiles('preview3', e.target.result as string);
            IDjenisGambar[2]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-4') {
            // setPreview4(e.target.result as string);
            updateStateFiles('preview4', e.target.result as string);
            IDjenisGambar[3]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-5') {
            // setPreview4(e.target.result as string);
            updateStateFiles('preview5', e.target.result as string);
            IDjenisGambar[4]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-1') {
            // setPreview(e.target.result as string);
            updateStateFiles('preview6', e.target.result as string);
            IDjenisGambar[5]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-2') {
            // setPreview2(e.target.result as string);
            updateStateFiles('preview7', e.target.result as string);
            IDjenisGambar[6]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-3') {
            // setPreview3(e.target.result as string);
            updateStateFiles('preview8', e.target.result as string);
            IDjenisGambar[7]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-4') {
            // setPreview4(e.target.result as string);
            updateStateFiles('preview9', e.target.result as string);
            IDjenisGambar[8]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-5') {
            // setPreview4(e.target.result as string);
            updateStateFiles('preview10', e.target.result as string);
            IDjenisGambar[9]?.setAttribute('id', jenis);
          }
        } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
          if (jenis === 'pengajuan-1') {
            // setPreview(e.target.result as string);
            updateStateFiles('preview1', resExcel);
            IDjenisGambar[0]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-2') {
            // setPreview2(resExcel);
            updateStateFiles('preview2', resExcel);
            IDjenisGambar[1]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-3') {
            // setPreview3(resExcel);
            updateStateFiles('preview3', resExcel);
            IDjenisGambar[2]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-4') {
            // setPreview4(resExcel);
            updateStateFiles('preview4', resExcel);
            IDjenisGambar[3]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-5') {
            // setPreview4(resExcel);
            updateStateFiles('preview5', resExcel);
            IDjenisGambar[4]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-1') {
            // setPreview(resExcel);
            updateStateFiles('preview6', resExcel);
            IDjenisGambar[5]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-2') {
            // setPreview2(resExcel);
            updateStateFiles('preview7', resExcel);
            IDjenisGambar[6]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-3') {
            // setPreview3(resExcel);
            updateStateFiles('preview8', resExcel);
            IDjenisGambar[7]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-4') {
            // setPreview4(resExcel);
            updateStateFiles('preview9', resExcel);
            IDjenisGambar[8]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-5') {
            // setPreview4(resExcel);
            updateStateFiles('preview10', resExcel);
            IDjenisGambar[9]?.setAttribute('id', jenis);
          }
        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
          if (jenis === 'pengajuan-1') {
            // setPreview(e.target.result as string);
            updateStateFiles('preview1', resWord);
            IDjenisGambar[0]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-2') {
            // setPreview2(resWord);
            updateStateFiles('preview2', resWord);
            IDjenisGambar[1]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-3') {
            // setPreview3(resWord);
            updateStateFiles('preview3', resWord);
            IDjenisGambar[2]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-4') {
            // setPreview4(resWord);
            updateStateFiles('preview4', resWord);
            IDjenisGambar[3]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-5') {
            // setPreview4(resWord);
            updateStateFiles('preview5', resWord);
            IDjenisGambar[4]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-1') {
            // setPreview(resWord);
            updateStateFiles('preview6', resWord);
            IDjenisGambar[5]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-2') {
            // setPreview2(resWord);
            updateStateFiles('preview7', resWord);
            IDjenisGambar[6]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-3') {
            // setPreview3(resWord);
            updateStateFiles('preview8', resWord);
            IDjenisGambar[7]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-4') {
            // setPreview4(resWord);
            updateStateFiles('preview9', resWord);
            IDjenisGambar[8]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-5') {
            // setPreview4(resWord);
            updateStateFiles('preview10', resWord);
            IDjenisGambar[9]?.setAttribute('id', jenis);
          }
        } else if (fileExtension === 'zip' || fileExtension === 'rar') {
          if (jenis === 'pengajuan-1') {
            // setPreview(e.target.result as string);
            updateStateFiles('preview1', resZip);
            IDjenisGambar[0]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-2') {
            // setPreview2(resZip);
            updateStateFiles('preview2', resZip);
            IDjenisGambar[1]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-3') {
            // setPreview3(resZip);
            updateStateFiles('preview3', resZip);
            IDjenisGambar[2]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-4') {
            // setPreview4(resZip);
            updateStateFiles('preview4', resZip);
            IDjenisGambar[3]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-5') {
            // setPreview4(resZip);
            updateStateFiles('preview5', resZip);
            IDjenisGambar[4]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-1') {
            // setPreview(resZip);
            updateStateFiles('preview6', resZip);
            IDjenisGambar[5]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-2') {
            // setPreview2(resZip);
            updateStateFiles('preview7', resZip);
            IDjenisGambar[6]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-3') {
            // setPreview3(resZip);
            updateStateFiles('preview8', resZip);
            IDjenisGambar[7]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-4') {
            // setPreview4(resZip);
            updateStateFiles('preview9', resZip);
            IDjenisGambar[8]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-5') {
            // setPreview4(resZip);
            updateStateFiles('preview10', resZip);
            IDjenisGambar[9]?.setAttribute('id', jenis);
          }
        } else if (fileExtension === 'pdf') {
          if (jenis === 'pengajuan-1') {
            // setPreview(e.target.result as string);
            updateStateFiles('preview1', resPdf);
            IDjenisGambar[0]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-2') {
            // setPreview2(resPdf);
            updateStateFiles('preview2', resPdf);
            IDjenisGambar[1]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-3') {
            // setPreview3(resPdf);
            updateStateFiles('preview3', resPdf);
            IDjenisGambar[2]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-4') {
            // setPreview4(resPdf);
            updateStateFiles('preview4', resPdf);
            IDjenisGambar[3]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-5') {
            // setPreview4(resPdf);
            updateStateFiles('preview5', resPdf);
            IDjenisGambar[4]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-1') {
            // setPreview(resPdf);
            updateStateFiles('preview6', resPdf);
            IDjenisGambar[5]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-2') {
            // setPreview2(resPdf);
            updateStateFiles('preview7', resPdf);
            IDjenisGambar[6]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-3') {
            // setPreview3(resPdf);
            updateStateFiles('preview8', resPdf);
            IDjenisGambar[7]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-4') {
            // setPreview4(resPdf);
            updateStateFiles('preview9', resPdf);
            IDjenisGambar[8]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-5') {
            // setPreview4(resPdf);
            updateStateFiles('preview10', resPdf);
            IDjenisGambar[9]?.setAttribute('id', jenis);
          }
        } else {
          if (jenis === 'pengajuan-1') {
            // setPreview(e.target.result as string);
            updateStateFiles('preview1', resUnknow);
            IDjenisGambar[0]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-2') {
            // setPreview2(resUnknow);
            updateStateFiles('preview2', resUnknow);
            IDjenisGambar[1]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-3') {
            // setPreview3(resUnknow);
            updateStateFiles('preview3', resUnknow);
            IDjenisGambar[2]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-4') {
            // setPreview4(resUnknow);
            updateStateFiles('preview4', resUnknow);
            IDjenisGambar[3]?.setAttribute('id', jenis);
          } else if (jenis === 'pengajuan-5') {
            // setPreview4(resUnknow);
            updateStateFiles('preview5', resUnknow);
            IDjenisGambar[4]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-1') {
            // setPreview(resUnknow);
            updateStateFiles('preview6', resUnknow);
            IDjenisGambar[5]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-2') {
            // setPreview2(resUnknow);
            updateStateFiles('preview7', resUnknow);
            IDjenisGambar[6]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-3') {
            // setPreview3(resUnknow);
            updateStateFiles('preview8', resUnknow);
            IDjenisGambar[7]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-4') {
            // setPreview4(resUnknow);
            updateStateFiles('preview9', resUnknow);
            IDjenisGambar[8]?.setAttribute('id', jenis);
          } else if (jenis === 'pembayaran-5') {
            // setPreview4(resUnknow);
            updateStateFiles('preview10', resUnknow);
            IDjenisGambar[9]?.setAttribute('id', jenis);
          }
        }
      } else {
        console.error("No elements found with class 'e-upload-files'");
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (kode_fpp: any) => {
    if (
      uploaderRefPengajuan1?.current &&
      uploaderRefPengajuan2?.current &&
      uploaderRefPengajuan3?.current &&
      uploaderRefPengajuan4?.current &&
      uploaderRefPengajuan5?.current &&
      uploaderRefPembayaran1?.current &&
      uploaderRefPembayaran2?.current &&
      uploaderRefPembayaran3?.current &&
      uploaderRefPembayaran4?.current &&
      uploaderRefPembayaran5?.current
    ) {
      const filesArray = [
        dataFiles?.preview1
          ? [
              {
                rawFile: await fetch(dataFiles?.preview1).then((res) => res.blob()),
                fileName: dataFiles?.nameImage1,
                originalName: uploaderRefPengajuan1?.current.getFilesData()[0]?.name,
                id: 1,
              },
            ]
          : uploaderRefPengajuan1?.current.getFilesData(),
        dataFiles?.preview2
          ? [
              {
                rawFile: await fetch(dataFiles?.preview2).then((res) => res.blob()),
                fileName: dataFiles?.nameImage2,
                originalName: uploaderRefPengajuan2?.current.getFilesData()[0]?.name,
                id: 2,
              },
            ]
          : uploaderRefPengajuan2?.current.getFilesData(),
        dataFiles?.preview3
          ? [
              {
                rawFile: await fetch(dataFiles?.preview3).then((res) => res.blob()),
                fileName: dataFiles?.nameImage3,
                originalName: uploaderRefPengajuan3?.current.getFilesData()[0]?.name,
                id: 3,
              },
            ]
          : uploaderRefPengajuan3?.current.getFilesData(),
        dataFiles?.preview4
          ? [
              {
                rawFile: await fetch(dataFiles?.preview4).then((res) => res.blob()),
                fileName: dataFiles?.nameImage4,
                originalName: uploaderRefPengajuan4?.current.getFilesData()[0]?.name,
                id: 4,
              },
            ]
          : uploaderRefPengajuan4?.current.getFilesData(),
        dataFiles?.preview5
          ? [
              {
                rawFile: await fetch(dataFiles?.preview5).then((res) => res.blob()),
                fileName: dataFiles?.nameImage5,
                originalName: uploaderRefPengajuan5?.current.getFilesData()[0]?.name,
                id: 5,
              },
            ]
          : uploaderRefPengajuan5?.current.getFilesData(),
        dataFiles?.preview6
          ? [
              {
                rawFile: await fetch(dataFiles?.preview6).then((res) => res.blob()),
                fileName: dataFiles?.nameImage6,
                originalName: uploaderRefPembayaran1?.current.getFilesData()[0]?.name,
                id: 20,
              },
            ]
          : uploaderRefPembayaran1?.current.getFilesData(),
        dataFiles?.preview7
          ? [
              {
                rawFile: await fetch(dataFiles?.preview7).then((res) => res.blob()),
                fileName: dataFiles?.nameImage7,
                originalName: uploaderRefPembayaran2?.current.getFilesData()[0]?.name,
                id: 21,
              },
            ]
          : uploaderRefPembayaran2?.current.getFilesData(),
        dataFiles?.preview8
          ? [
              {
                rawFile: await fetch(dataFiles?.preview8).then((res) => res.blob()),
                fileName: dataFiles?.nameImage8,
                originalName: uploaderRefPembayaran3?.current.getFilesData()[0]?.name,
                id: 22,
              },
            ]
          : uploaderRefPembayaran3?.current.getFilesData(),
        dataFiles?.preview9
          ? [
              {
                rawFile: await fetch(dataFiles?.preview9).then((res) => res.blob()),
                fileName: dataFiles?.nameImage9,
                originalName: uploaderRefPembayaran4?.current.getFilesData()[0]?.name,
                id: 23,
              },
            ]
          : uploaderRefPembayaran4?.current.getFilesData(),
        dataFiles?.preview10
          ? [
              {
                rawFile: await fetch(dataFiles?.preview10).then((res) => res.blob()),
                fileName: dataFiles?.nameImage10,
                originalName: uploaderRefPembayaran5?.current.getFilesData()[0]?.name,
                id: 24,
              },
            ]
          : uploaderRefPembayaran5?.current.getFilesData(),
      ];
      console.log(filesArray);
      let filesAdded = false;

      filesArray.forEach((file) => {
        if (file.length > 0) {
          filesAdded = true;
        }
      });

      const files = filesArray.filter((arr) => arr.length > 0).flat();

      if (filesAdded) {
        const combinedArray: any[] = [];
        try {
          for (const item of files) {
            console.log('item: ', item);

            const formData = new FormData();
            formData.append('myimage', item.rawFile);
            formData.append('ets', kode_entitas);
            formData.append('nama_file_image', item.fileName);
            formData.append('id', item.id.toString());
            formData.append('dokumen', 'UM');
            formData.append('kode_dokumen', kode_fpp);

            const response = await axios.post(`${apiUrl}/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (response.status === 200) {
              const result = response.data;
              console.log('Upload successful:', result);

              const json = {
                entitas: kode_entitas,
                kode_dokumen: kode_fpp,
                id_dokumen: item.id.toString(),
                dokumen: 'UM',
                filegambar: item.fileName,
                fileoriginal: item.originalName,
              };

              combinedArray.push(json);

              if (statusPage === 'EDIT') {
                const combinedIds = combinedArray.map((item: any) => item.id_dokumen.toString());
                const editIds = jsonImageEdit.map((item: any) => item.id_dokumen.toString());
                const missingIds = editIds.filter((id) => !combinedIds.includes(id));
                const paramsArrayDelete = missingIds.join(',');
                // console.log(paramsArrayDelete);
                if (paramsArrayDelete !== '') {
                  //DELETE TB_IMAGES
                  try {
                    const response = await axios.delete(`${apiUrl}/erp/hapus_file_pendukung`, {
                      params: {
                        entitas: kode_entitas,
                        param1: kode_dokumen,
                        param2: paramsArrayDelete, // Sesuaikan dengan data yang diperlukan untuk menghapus
                      },
                    });
                    console.log('Response dari penghapusan file pendukung:', response.data);
                  } catch (error) {
                    console.error('Error saat menghapus file pendukung:', error);
                  }
                } else {
                  console.log('tidak ada yg perlu dihapus');
                }
              }

              // INSERT
              try {
                // Simpan data ke database
                const insertResponse = await axios.post(`${apiUrl}/erp/simpan_tbimages`, combinedArray);
                console.log(insertResponse);
              } catch (error) {
                console.error('Error saat menyimpan data baru:', error);
              }
            } else {
              console.error('Upload failed:', formData);
            }
          }
        } catch (error) {
          console.error('Error uploading files:', error);
        }
      } else {
        //hapus semua
        if (jsonImageEdit.length > 0) {
          try {
            const response = await axios.delete(`${apiUrl}/erp/hapus_file_pendukung`, {
              params: {
                entitas: kode_entitas,
                param1: kode_dokumen,
                param2: '1,2,3,4,5,20,21,22,23,24', // Sesuaikan dengan data yang diperlukan untuk menghapus
              },
            });
            // console.log('Response dari penghapusan file pendukung:', response.data);
          } catch (error) {
            console.error('Error saat menghapus file pendukung:', error);
          }
        }
      }
    } else {
      console.log('Uploader refs are not defined');
    }
  };

  const handleDownloadImage = (jenis: string) => {
    const imageUrl =
      jenis === 'pengajuan-1'
        ? dataFiles?.preview1
        : jenis === 'pengajuan-2'
        ? dataFiles?.preview2
        : jenis === 'pengajuan-3'
        ? dataFiles?.preview3
        : jenis === 'pengajuan-4'
        ? dataFiles?.preview4
        : jenis === 'pengajuan-5'
        ? dataFiles?.preview5
        : jenis === 'pembayaran-1'
        ? dataFiles?.preview6
        : jenis === 'pembayaran-2'
        ? dataFiles?.preview7
        : jenis === 'pembayaran-3'
        ? dataFiles?.preview8
        : jenis === 'pembayaran-4'
        ? dataFiles?.preview9
        : jenis === 'pembayaran-5'
        ? dataFiles?.preview10
        : null;
    const fileName =
      jenis === 'pengajuan-1'
        ? dataFiles?.nameImage1
        : jenis === 'pengajuan-2'
        ? dataFiles?.nameImage2
        : jenis === 'pengajuan-3'
        ? dataFiles?.nameImage3
        : jenis === 'pengajuan-4'
        ? dataFiles?.nameImage4
        : jenis === 'pengajuan-5'
        ? dataFiles?.nameImage5
        : jenis === 'pembayaran-1'
        ? dataFiles?.nameImage6
        : jenis === 'pembayaran-2'
        ? dataFiles?.nameImage7
        : jenis === 'pembayaran-3'
        ? dataFiles?.nameImage8
        : jenis === 'pembayaran-4'
        ? dataFiles?.nameImage9
        : jenis === 'pembayaran-5'
        ? dataFiles?.nameImage10
        : null;

    if (!imageUrl || !fileName) {
      console.error('No image to download');
      return;
    }

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemove = (jenis: any) => {
    const element: any = document.getElementById(jenis);
    if (element !== null) {
      element.parentNode.removeChild(element);
    }
    if (jenis === 'pengajuan-1') {
      updateStateFiles('preview1', null);
    } else if (jenis === 'pengajuan-2') {
      updateStateFiles('preview2', null);
    } else if (jenis === 'pengajuan-3') {
      updateStateFiles('preview3', null);
    } else if (jenis === 'pengajuan-4') {
      updateStateFiles('preview4', null);
    } else if (jenis === 'pengajuan-5') {
      updateStateFiles('preview5', null);
    } else if (jenis === 'pembayaran-1') {
      updateStateFiles('preview6', null);
    } else if (jenis === 'pembayaran-2') {
      updateStateFiles('preview7', null);
    } else if (jenis === 'pembayaran-3') {
      updateStateFiles('preview8', null);
    } else if (jenis === 'pembayaran-4') {
      updateStateFiles('preview9', null);
    } else if (jenis === 'pembayaran-5') {
      updateStateFiles('preview10', null);
    } else if (jenis === 'pembayaran-all') {
      withReactContent(swal)
        .fire({
          html: 'Apakah anda akan membersihkan semua gambar?',
          width: '20%',
          target: '#dialogFrmDp',
          showCancelButton: true,
          confirmButtonText: '<p style="font-size:10px">Ya</p>',
          cancelButtonText: '<p style="font-size:10px">Tidak</p>',
        })
        .then((result) => {
          if (result.isConfirmed) {
            setDataFiles((prevState: any) => ({
              ...prevState,
              preview6: null,
              preview7: null,
              preview8: null,
              preview9: null,
              preview10: null,
            }));
            const elements: any = document.getElementsByClassName('e-upload-file-list');
            while (elements.length > 0) {
              elements[0].parentNode.removeChild(elements[0]);
            }
          } else {
            console.log('cancel');
          }
        });
    } else if (jenis === 'pengajuan-all') {
      withReactContent(swal)
        .fire({
          html: 'Apakah anda akan membersihkan semua gambar?',
          width: '20%',
          target: '#dialogFrmDp',
          showCancelButton: true,
          confirmButtonText: '<p style="font-size:10px">Ya</p>',
          cancelButtonText: '<p style="font-size:10px">Tidak</p>',
        })
        .then((result) => {
          if (result.isConfirmed) {
            setDataFiles((prevState: any) => ({
              ...prevState,
              preview1: null,
              preview2: null,
              preview3: null,
              preview4: null,
              preview5: null,
            }));
            const elements: any = document.getElementsByClassName('e-upload-file-list');
            while (elements.length > 0) {
              elements[0].parentNode.removeChild(elements[0]);
            }
          } else {
            console.log('cancel');
          }
        });
    }
  };

  return {
    dataFiles,
    setDataFiles,
    updateStateFiles,
    setJsonImageEdit,
    handleUpload,
    handleFileSelect,
    handleDownloadImage,
    handleRemove,
    selectedHead,
    setSelectedHead,
    imageSrc,
    uploaderRefPengajuan1,
    uploaderRefPengajuan2,
    uploaderRefPengajuan3,
    uploaderRefPengajuan4,
    uploaderRefPengajuan5,
    uploaderRefPembayaran1,
    uploaderRefPembayaran2,
    uploaderRefPembayaran3,
    uploaderRefPembayaran4,
    uploaderRefPembayaran5,
  };
};

export default useUploadFiles2;
