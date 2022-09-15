import {NextApiRequest, NextApiResponse} from "next";
import { findVideoIdByUserId, insertNewStat, updateStatWatched} from "../../lib/db/hasura";
import {verifyToken} from "../../lib/utils";

const stats = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(403).send({})
        } else {
            let videoId: string;
            if (req.method === 'POST') {
                videoId = req?.body?.videoId ? req?.body?.videoId : '';
            } else {
                videoId = req?.query?.videoId ? typeof req?.query?.videoId !== 'string' ? req?.query?.videoId[0] : req?.query?.videoId : '';
            }
            if (videoId) {
                const userId = await verifyToken(token);
                const findVideo = await findVideoIdByUserId(userId, videoId, token);
                const doesStatsExist = !!findVideo?.length;

                if (req.method === 'POST') {
                    const {watched = true, favourited} = req.body;
                    if (doesStatsExist) {
                        // update
                        const response = await updateStatWatched({
                            userId,
                            videoId,
                            watched,
                            favourited
                        }, token)
                        res.send({done: true, data: response})
                    } else {
                        // insert
                        const response = await insertNewStat(
                            {userId, videoId, favourited, watched}, token
                        );
                        res.send({done: true, data: response})
                    }
                } else {
                    if (doesStatsExist) {
                        res.send(findVideo)
                    } else {
                        res.send({Video: null, msg: 'Video not found'})
                    }
                }
            } else {
                res.status(404);
                res.send({done: false})
            }
        }
    } catch(error) {
        res.status(500).send({done: false, error: (error as Error).message  })
    }
}

export default stats;

