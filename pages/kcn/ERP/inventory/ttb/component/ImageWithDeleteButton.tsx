import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { OpenPreview, OpenPreviewInsert } from '../functional/fungsiFormTtb';

interface ImageWithDeleteButtonProps {
    imageUrl: any;
    onDelete: any;
    index: any;
    setIndexPreview: Function;
    setIsOpenPreview: Function;
    setZoomScale: Function;
    setPosition: Function;
    loadFilePendukung: any;
    extractedFiles: any;
    setImageDataUrl: Function;
    images: any;
}

const ImageWithDeleteButton: React.FC<ImageWithDeleteButtonProps> = ({
    imageUrl,
    onDelete,
    index,
    setIndexPreview,
    setIsOpenPreview,
    setZoomScale,
    setPosition,
    loadFilePendukung,
    extractedFiles,
    setImageDataUrl,
    images,
}: ImageWithDeleteButtonProps) => {
    return (
        <div style={{ position: 'relative' }}>
            <img
                src={imageUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '216px' }}
                onClick={() => OpenPreviewInsert(index, setIndexPreview, setIsOpenPreview, setZoomScale, setPosition, loadFilePendukung, extractedFiles, setImageDataUrl, images)}
            />
            <button
                style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    color: '#3c405d',
                    borderRadius: '2%',
                    cursor: 'pointer',
                    fontSize: '18px',
                }}
                onClick={onDelete}
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
    );
};

export default ImageWithDeleteButton;
