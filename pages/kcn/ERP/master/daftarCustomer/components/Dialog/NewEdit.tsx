import { ButtonPropsModel, DialogComponent } from '@syncfusion/ej2-react-popups';
import React from 'react';

interface NewEditProps {
    isOpen: boolean;
    onClose: () => void;
    params: object;
    state: string;
    footerButtonTemplate: Function[];
}
const NewEditDialog = ({ isOpen, onClose, params, state, footerButtonTemplate }: NewEditProps) => {
    const title = state === 'new' ? 'Tambah Customer Baru' : 'Ubah Customer : '
    const dialogClose = () => {
        onClose();
    };
    return (
        <DialogComponent
            id="dialogJUList"
            isModal={true}
            width="95%"
            height="100%"
            visible={isOpen}
            close={dialogClose}
            header={title}
            showCloseIcon={true}
            target="#main-target"
            closeOnEscape={false}
            footerTemplate={footerButtonTemplate}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            enableResize={true}
        >
        </DialogComponent>
    );
};

export default NewEditDialog;
