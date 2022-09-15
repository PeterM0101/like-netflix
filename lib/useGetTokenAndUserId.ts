import jwt from "jsonwebtoken";
import {verifyToken} from "./utils";
import {GetServerSidePropsContext} from "next";

const useGetTokenAndUserId = async (context: GetServerSidePropsContext) => {
    const token = context?.req ? context?.req?.cookies?.token : null;
    if (token) jwt.decode(token)
    const userId = await verifyToken(token!);

    return {userId, token}
}

export default useGetTokenAndUserId;

