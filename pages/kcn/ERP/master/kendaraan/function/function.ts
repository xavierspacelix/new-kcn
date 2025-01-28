export const resetFilePendukung = () => {
    return {
        1: {
            file: null,
            fileUrl: null,
            tabIndex: 1,
        },
        2: {
            file: null,
            fileUrl: null,
            tabIndex: 2,
        },
        3: {
            file: null,
            fileUrl: null,
            tabIndex: 3,
        },
        4: {
            file: null,
            fileUrl: null,
            tabIndex: 4,
        },
        5: {
            file: null,
            fileUrl: null,
            tabIndex: 5,
        },
        6: {
            file: null,
            fileUrl: null,
            tabIndex: 6,
        },
        7: {
            file: null,
            fileUrl: null,
            tabIndex: 8,
        },

        8: {
            file: null,
            fileUrl: null,
            tabIndex: 9,
        },
        9: {
            file: null,
            fileUrl: null,
            tabIndex: 10,
        },
        10: {
            file: null,
            fileUrl: null,
            tabIndex: 11,
        },
        11: {
            file: null,
            fileUrl: null,
            tabIndex: 12,
        },
        12: {
            file: null,
            fileUrl: null,
            tabIndex: 13,
        },
        13: {
            file: null,
            fileUrl: null,
            tabIndex: 14,
        },
        14: {
            file: null,
            fileUrl: null,
            tabIndex: 15,
        },

        15: {
            file: null,
            fileUrl: null,
            tabIndex: 15,
        },
        16: {
            file: null,
            fileUrl: null,
            tabIndex: 16,
        },
        17: {
            file: null,
            fileUrl: null,
            tabIndex: 17,
        },
        18: {
            file: null,
            fileUrl: null,
            tabIndex: 18,
        },
        19: {
            file: null,
            fileUrl: null,
            tabIndex: 19,
        },
        20: {
            file: null,
            fileUrl: null,
            tabIndex: 20,
        },
        51: {
            file: null,
            fileUrl: null,
            tabIndex: 51,
        },
        52: {
            file: null,
            fileUrl: null,
            tabIndex: 52,
        },
    };
};

export const downloadBase64Image = (base64Image: string, filename: string) => {
    const byteString = atob(base64Image.split(',')[1]); // Decode base64
    const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0]; // Extract mime type

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });

    // Create an object URL for the blob
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element, set its href to the blob URL and download attribute
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;

    // Append link to the body, click it and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the object URL
    URL.revokeObjectURL(blobUrl);
};
