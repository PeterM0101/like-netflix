export interface VideoI {
  imgUrl: string;
  id: string;
  title?: string;
}

export interface VideoType {
  title: string;
  publishTime: string;
  description: string;
  channelTitle: string;
  viewCount: number;
}

// {
//   kind: "youtube#searchResult";
//   etag: "Nnv-Wle1PWntCoVu4eyjK84vrUo";
//   id: {
//     kind: "youtube#video";
//     videoId: "u8ZsUivELbs";
//   };
//   snippet: {
//     publishedAt: "2021-01-06T16:00:03Z";
//     channelId: "UCWOA1ZGywLbqmigxE4Qlvuw";
//     title: "Outside the Wire | Official Trailer | Netflix";
//     description: "Check out the NEW official trailer for Outside the Wire! When disgraced drone pilot, Lt. Harp (Damson Idris) is sent into a deadly ...";
//     thumbnails: {
//       default: {
//         url: "https://i.ytimg.com/vi/u8ZsUivELbs/default.jpg";
//         width: 120;
//         height: 90;
//       };
//       medium: {
//         url: "https://i.ytimg.com/vi/u8ZsUivELbs/mqdefault.jpg";
//         width: 320;
//         height: 180;
//       };
//       high: {
//         url: "https://i.ytimg.com/vi/u8ZsUivELbs/hqdefault.jpg";
//         width: 480;
//         height: 360;
//       };
//     };
//     channelTitle: "Netflix";
//     liveBroadcastContent: "none";
//     publishTime: "2021-01-06T16:00:03Z";
//   };
// }
