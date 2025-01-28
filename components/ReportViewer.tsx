import { Viewer } from "@grapecity/activereports-react";
import { Props as ViewerProps } from "@grapecity/activereports-react";
import { PdfExport } from "@grapecity/activereports";
 
import React from "react";
// import the default theme for the report viewer 
//import "@grapecity/activereports/styles/ar-js-ui.css";
//import "@grapecity/activereports/styles/ar-js-viewer.css";  

import "@grapecity/activereports/styles/light-blue-ui.css";
import "@grapecity/activereports/styles/light-blue-viewer.css";  

// eslint-disable-next-line
const pdf = PdfExport;

// eslint-disable-next-line react/display-name
const ViewerWrapper = (props: ViewerWrapperProps) => {

  const ref = React.useRef<Viewer>(null);
  React.useEffect(() => {
    ref.current?.Viewer.open(props.reportUri, props.reportParam);
  }, [props.reportUri, props.reportParam]);
  return <Viewer {...props} ref={ref} />;
};

export type ViewerWrapperProps = ViewerProps & { reportUri: string, reportParam: object };

export default ViewerWrapper;