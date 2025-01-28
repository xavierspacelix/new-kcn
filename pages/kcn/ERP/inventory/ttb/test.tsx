import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ViewerWrapperProps } from '../../../../../components/ReportViewer';

// use the dynamic import to load the report viewer wrapper: https://nextjs.org/docs/advanced-features/dynamic-import
import dynamic from "next/dynamic";
const Viewer = dynamic<ViewerWrapperProps | any>(
    async () => {
      return (await import("../../../../../components/grapecity-viewer")).default;
    },
    { ssr: false }
  );

  

const Home: NextPage = () => {

    const [entitas, setEntitas] = useState('');
    const [kodeTtb, setKodeTtb] = useState('');

    useEffect(() => {
        const urlSearchString = window.location.search;
        const params = new URLSearchParams(urlSearchString);
        const entitas = params.get('entitas');
        const param1 = params.get('kode_ttb');

        if (entitas !== null) {
            setEntitas(entitas);
        }
        if (param1 !== null) {
            setKodeTtb(param1);
        }
    }, []);

    const parameter = {
        ReportParams: [
            {
                Name: 'entitas',
                Value: [entitas],
            },
            {
                Name: 'param1',
                Value: [kodeTtb],
            },
        ],
    };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
        <h1>TESS</h1>
      <Viewer reportUri="/form_ttb1.rdlx-json" reportParam={parameter} />
    </div>
  );
};

export default Home;