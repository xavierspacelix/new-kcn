import React from 'react';
import { Viewer } from '@grapecity/activereports-react';
import { Props as ViewerProps } from '@grapecity/activereports-react';
import { PdfExport } from '@grapecity/activereports';
import { Core } from '@grapecity/activereports';
Core.setLicenseKey(
    'BOARD4ALL,wifier,B4C850C346AF477#B0iiWu3Waz9WZ4hXRgAicldXZpZFdy3GclJFIv5mapdlI0IiTisHL3JyS7gDSiojIDJCLi86bpNnblRHeFBCI73mUpRHb55EIv5mapdlI0IiTisHL3JCNGZDRiojIDJCLi86bpNnblRHeFBCIQFETPBCIv5mapdlI0IiTisHL3JyMDBjQiojIDJCLiUmcvNEIv5mapdlI0IiTisHL3JSV8cTQiojIDJCLi86bpNnblRHeFBCI4JXYoNEbhl6YuFmbpZEIv5mapdlI0IiTisHL3JSSGljQiojIDJCLiITMuYHITpEIkFWZyB7UiojIOJyes4nIZRVV9IiOiMkIsISM6ByUKN7dllmVhRXYEJiOi8kI1xSfi24QRpkI0IyQiwiIzYFITpEdy3GclJVZ6lGdjFkI0IiTisHL3JCTBF5UiojIDJCLiUTMuYHITpEIkFWZyB7UiojIOJyebpjIkJHUiwSZzxWYmpjIsZXRiwSflVnc4pjIyNHZisnOiwmbBJCLiEDMwAjMxASMwEDMyIDMyIiOiQncDJCLioXai9CbsFGNkJXYvJGQyVWaml6diojIh94QiwiI7cDNGFkN4MzQwUDODRjQiojIklkI1pjIEJye&QfiADNyQUM6cjMiojIIJCLi4TPnZUOQ3kMqFmeJ9WbYVkb7BVTtZEM6wWY5QjWxITZzNnTGtiVUp5arlje4IlMo3kcBhnVCdXVQJ5MjtmSClENXlXVjZVeQdFOJBjWHFUUyUVYu5kNwMTaxNHUplnbjNlctljN6t6coF6bEp6U8A5YJtSa62WRSR4SJRGem9UUvQ6TYJjVCRXbWdEbHxERphlSDpkQGZGZkNnNMhmUycjc6VHMTFGOItWV4kmMOpXWspXNYlzZzMFNxt4b5clVpFXdUJmdFV6MmhkQz3kQBlEZ6UjZHJ7RZF6QGhVYkNVW9E7QPB7MroHVk5WQ0BFbzN5ZYJVUGZjePllS8EWSwQ5VFp7SxRzKvtydEZFRyhEbyJTdhp7U43Sb63ST0pFTaFnNsdWQ5Q5QEZDN4BHZ0RGeyB7bS56YoFEcwQzNKJGb5AVcLp7dj3UdO3Sbz5mNPx6S5hzMvZkWiojITJCL35VfiIVV84kI0IyQiwiIvJHcgMjVgIXZ7VWaWZGZQN6RiojIOJyes4nIJBjMSJiOiMkIsIibvl6cuVGd8VEIgQXZlh6U8VGbGBybtpWaXJiOi8kI1xSfiUTSOFlI0qyii'
);
// import the default theme for the report viewer
// import '@grapecity/activereports/styles/ar-js-viewer.css';
// import '@grapecity/activereports/styles/ar-js-ui.css';
// import '@grapecity/activereports/styles/dark-yellow-viewer.css';
// import '@grapecity/activereports/styles/dark-yellow-ui.css';
// import '@grapecity/activereports/styles/green-viewer.css';
// import '@grapecity/activereports/styles/green-ui.css';
import '@grapecity/activereports/styles/light-blue-viewer.css';
import '@grapecity/activereports/styles/light-blue-ui.css';
// import '@grapecity/activereports/styles/ar-js-viewer-custom.css';
// import '@grapecity/activereports/styles/ar-js-ui-custom.css';

const pdf = PdfExport;

const ViewerWrapper = (props: ViewerWrapperProps) => {
    const ref = React.useRef<Viewer>(null);
    React.useEffect(() => {
        ref.current?.Viewer.open(props.reportUri, props.reportParam);
        setTimeout(() => {
            ref.current?.print();
        },200)
    }, [props.reportUri, props.reportParam]);
    return <Viewer {...props} ref={ref} />;
};

export type ViewerWrapperProps = ViewerProps & { reportUri: string; reportParam: object };

export default ViewerWrapper;