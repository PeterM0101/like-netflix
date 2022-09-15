import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
    if (token) {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded.issuer;
    } else {
        return null
    }
}
