import React, {FC} from 'react';
import styles from './banner.module.scss';
import Image from "next/image";
import {useRouter} from "next/router";

interface BannerProps {
    title: string,
    subTitle: string,
    imgUrl: string,
    videoId: string
}

const Banner: FC<BannerProps> = ({title, subTitle, imgUrl, videoId}) => {

    const router = useRouter();

    const handleOnPlay = () => {
        router.push(`/video/${videoId}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftWrapper}>
                <div className={styles.left}>
                    <div className={styles.nseriesWrapper}>
                        <p className={styles.firstLetter}>N</p>
                        <p className={styles.series}>S E R I E S</p>
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                    <h3 className={styles.subTitle}>{subTitle}</h3>
                    <div className={styles.buttonWrapper}>
                        <button className={styles.btnWithIcon} onClick={handleOnPlay}>
                            <Image
                                src="/static/play.svg"
                                width={32}
                                height={32}
                                alt={"play"}
                            />
                            <span className={styles.playText}>Play</span>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={styles.bannerImg}
                style={{ backgroundImage: `url(${imgUrl})` }}
            ></div>
        </div>
    );
};

export default Banner;
