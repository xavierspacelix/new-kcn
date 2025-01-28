const checkboxTemplateListPS = (props: any) => {
    // Jika nilai kolom "beban" adalah "Y", centang checkbox, jika tidak, kosongkan
    const checkboxStyle = {
        backgroundColor: props.beban === 'Y' ? '#f2f2f2' : 'transparent', // Menyesuaikan latar belakang berdasarkan nilai "beban"
    };
    return <input type="checkbox" checked={props.beban === 'Y'} style={checkboxStyle} readOnly />;
};

export default checkboxTemplateListPS;
