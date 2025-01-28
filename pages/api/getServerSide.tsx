//Get Server Side from iron-session/next
import { withSessionSsr } from '@/lib/withSession';
import { getUserData } from '@/utils/auth';

export const getServerSideProps = withSessionSsr(async function getServersideProps({ req, res }) {
    if (!req.session || !req.session.userid) {
        res.writeHead(302, {
            Location: '/',
        });
        res.end();
        return { props: {} };
    }

    const userData = await getUserData(req);

    return {
        props: userData,
    };
});
