const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';
import moment from 'moment';

// PS
const GetListPS = async (paramObject: any): Promise<any[]> => {
    const { kode_entitas, vParam1, vParam2, vParam3, vParam4, vParam5, vParam6, vParam7 } = paramObject;
    const response = await axios.get(`${apiUrl}/erp/list_ps?`, {
        params: {
            entitas: kode_entitas,
            param1: vParam1,
            param2: vParam2,
            param3: vParam3,
            param4: vParam4,
            param5: vParam5,
            param6: vParam6,
            param7: vParam7,
        },
        // headers: { 'Cache-Control': 'no-store' },
    });
    const responseData = response.data.data;
    return responseData;
};

export {
    GetListPS,
};
