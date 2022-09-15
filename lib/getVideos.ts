import videoTestData from '../data/videos.json';
import {getWatchedVideosQuery} from "./db/hasura";

const fetchVideos = async (url: string) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = "youtube.googleapis.com/youtube/v3";

    const response = await fetch(
        `https://${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`
    );
    return await response.json();
};

export const getCommonVideos = async (url: string) => {

    try {
        const data: any = process.env.DEVELOPMENT === 'true'
            ? videoTestData
            : await fetchVideos(url);

        if (data?.error) {
            console.error("Youtube API error", data.error);
            return [];
        }

        return data.items.map((video: any) => {
            const id = video.id.videoId || video.id;
            const snippet = video.snippet;
            return {
                imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                title: video.snippet?.title,
                id,
                description: snippet?.description,
                publishTime: snippet?.publishedAt,
                channelTitle: snippet?.channelTitle,
                viewCount: video.statistics ? video.statistics.viewCount : 0,
            };
        });
    } catch (error) {
        console.error(`Something went wrong ${(error as Error).message}`);
        return [];
    }
};

export const getPopularVideos = async () => {
    const URL =
        "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=11&regionCode=US";

    return getCommonVideos(URL);
};

// export const getCommonVideos = async (searchQuery: string) => {
//     const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
//     const BASE_URL = "youtube.googleapis.com/youtube/v3";
//
//     // 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=disney%20trailer&key=[YOUR_API_KEY]'
//     const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${searchQuery}&key=${YOUTUBE_API_KEY}`);
//
//     const data: any = await response.json();
//
//
//     return videos.items.map(
//         (item: any) => ({
//             videoId: typeof item?.id === 'string' ? item?.id : item?.id?.videoId,
//             imgUrl: item.snippet.thumbnails.high.url,
//             title: item.snippet.title
//         })
//     );
// }

export const getVideos = async (searchQuery: string) => {
    const URL = `search?part=snippet&maxResults=11&q=${searchQuery}&type=video`;
    return getCommonVideos(URL);
};

export const getVideo = async (videoId: string) => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&&id=${videoId}`;

    const rez = await getCommonVideos(URL);

    const data: any = process.env.DEVELOPMENT === 'true'
        ? [rez.find((video: any) => video.id === videoId)]
        : rez;
    return data;
}

export const getVideosAndTransform = async (token: string, userId: string, cb: (token: string, userId: string)=>Promise<any[]>) => {
    const videos = await cb(token, userId);

    return videos?.map((video: any) => ({id: video.videoId, imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`}))
}
