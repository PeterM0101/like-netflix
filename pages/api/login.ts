import {NextApiRequest, NextApiResponse} from "next";
import {magicAdmin} from "../../lib/magicAdmin";
import jwt from 'jsonwebtoken';
import {createNewUser, isNewUserQuery} from "../../lib/db/hasura";
import {setTokenCookie} from "../../lib/cookies";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const auth = req.headers.authorization;
            const DIDToken = auth ? auth?.slice(7): "";

            if (DIDToken) {
                const metadata = await magicAdmin.users.getMetadataByToken(DIDToken);
                const jwtToken = jwt.sign(
                    {
                        ...metadata,
                        iat: Math.floor(Date.now() / 1000 - 1000),
                        exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
                        "https://hasura.io/jwt/claims": {
                            "x-hasura-allowed-roles": ["user", "admin"],
                            "x-hasura-default-role": "user",
                            "x-hasura-user-id": `${metadata.issuer}`,
                        },
                    },
                    process.env.JWT_SECRET!
                );
                const isNewUser = await isNewUserQuery(jwtToken, metadata.issuer!);
                isNewUser && await createNewUser(jwtToken, metadata);
                setTokenCookie(jwtToken, res);
                res.send({done: true})
            }

        } catch(error) {
            console.error('Something went wrong! ', (error as Error).message)
            res.status(500).send({done: false});
        }
    } else {
        res.send({done: false})
    }

}

export default login;
