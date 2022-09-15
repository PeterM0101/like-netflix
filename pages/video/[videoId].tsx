import React, {FC, useEffect, useRef, useState} from 'react';
import {useRouter} from "next/router";
import Modal from 'react-modal';
import styles from '../../styles/Video.module.scss';
import classNames from "classnames";
import {GetStaticProps} from "next";
import {getVideo} from "../../lib/getVideos";
import NavBar from "../../components/nav/nav";
import Like from "../../components/icons/like";
import DisLike from "../../components/icons/dislike";

interface VideoIdProps {
    video: any
}

Modal.setAppElement('#__next');

const VideoId: FC<VideoIdProps> = ({video}) => {
    const router = useRouter();
    let videoId = router.query.videoId ? router.query.videoId : '';
    if (typeof videoId !== 'string') videoId=videoId[0];
    const [likeStatus, setLikeStatus] = useState(false);
    const [dislikeStatus, setDislikeStatus] = useState(false);
    const { title, description, channelTitle, viewCount, publishTime } = video;
    const firstTime = useRef<boolean>(true);

    useEffect(
        () => {
            (
                async () => {
                    const response = await fetch(`/api/stats?videoId=${videoId}`);
                    const data = await response.json();
                    if (data?.length) {
                        const {favourited} = data[0];
                        if (favourited === 0) setDislikeStatus(true);
                        if (favourited === 1) setLikeStatus(true);
                    }
                }
            )();
        }, []
    )

    useEffect(
        () => {
            if (!firstTime.current) {
                (
                    async () => {
                        console.log('Add film to stats...')
                        const response = await fetch('/api/stats', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({videoId, favourited: likeStatus ? 1 : dislikeStatus ? 0 : null})
                        })
                        console.log('data: ', await response.json())
                    }
                )();
            }
        }, [likeStatus, dislikeStatus]
    )

    const handleSelectLike = async () => {
        if (firstTime.current) firstTime.current = false;
        if (dislikeStatus) {
            setDislikeStatus(false);
        } else {
            setLikeStatus(prev => !prev);
        }
    }

    const handleSelectDislike = async () => {
        if (firstTime.current) firstTime.current = false;
        if (likeStatus) {
            setLikeStatus(false);
        } else {
            setDislikeStatus(prev =>  !prev);
        }
    }

    return (
        <div className={styles.container}>
            <NavBar />
            <Modal
                isOpen={true}
                className={styles.modal}
                contentLabel="Watch the video"
                onRequestClose={()=>{
                    router.back();
                }}
                overlayClassName={styles.overlay}
            >
                    <iframe
                        id="ytplayer"
                        className={styles.videoPlayer}
                        width="100%"
                        height="360"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
                        frameBorder="0"
                    ></iframe>
                    <div className={styles.likeDislikeBtnWrapper}>
                            <button className={styles.likeBtnWrapper} onClick={handleSelectLike}>
                                <div className={styles.btnWrapper}>
                                    <Like fill={"white"} selected={likeStatus} />
                                </div>
                            </button>
                            <button onClick={handleSelectDislike}>
                                <div className={styles.btnWrapper}>
                                    <DisLike fill={"white"} selected={dislikeStatus} />
                                </div>
                            </button>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={styles.modalBodyContent}>
                            <div className={styles.col1}>
                                <p className={styles.publishTime}>{publishTime}</p>
                                <p className={styles.title}>{title}</p>
                                <p className={styles.description}>{description}</p>
                            </div>
                            <div className={styles.col2}>
                                <p className={classNames(styles.subText, styles.subTextWrapper)}>
                                    <span className={styles.textColor}>Cast: </span>
                                    <span className={styles.channelTitle}>{channelTitle}</span>
                                </p>
                                <p className={classNames(styles.subText, styles.subTextWrapper)}>
                                    <span className={styles.textColor}>View Count: </span>
                                    <span className={styles.channelTitle}>{viewCount}</span>
                                </p>
                            </div>
                        </div>
                    </div>
            </Modal>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {

    const videoId = context?.params?.videoId;
    const videoArray = await getVideo(videoId ? String(videoId) : "4zH5iYM4wJo");

    return {
        props: {
            video: videoArray.length > 0 ? videoArray[0] : {},
        },
        revalidate: 10, // In seconds
    }
}

export async function getStaticPaths() {
    const listOfVideos = ["4zH5iYM4wJo", "UaVTIH8mujA", "0jBmDOTx5tY"];

    const paths = listOfVideos.map((video) => ({
        params: { videoId: video },
    }))

    return { paths, fallback: 'blocking' }
}

export default VideoId;
