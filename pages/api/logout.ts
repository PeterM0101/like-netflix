import {NextApiRequest, NextApiResponse} from "next";
import { magicAdmin } from "../../lib/magicAdmin";
import { removeTokenCookie } from "../../lib/cookies";
import { verifyToken } from "../../lib/utils";

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('!req.cookie: ', req.cookies)
        try {
            if (!req.cookies.token)
                return res.status(401).json({ message: "User is not logged in" });
            const token = req.cookies.token;

            const userId = await verifyToken(token);
            removeTokenCookie(res);
            try {
                console.log({userId})
                await magicAdmin.users.logoutByIssuer(userId);
            } catch (error) {
                console.log("User's session with Magic already expired");
                console.error("Error occurred while logging out magic user", error);
            } finally {
                //redirects user to login page
                res.writeHead(302, { Location: "/login" });
                res.end();
            }
        } catch (error) {
            console.error({ error });
            res.status(401).json({ message: "User is not logged in" });
        }
}

export default logout;
