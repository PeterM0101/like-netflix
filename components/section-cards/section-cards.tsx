import React, {FC} from 'react';
import styles from './section-cards.module.scss';
import Card from "../card/card";
import {VideoI} from "../../model";
import classes from "classnames";

interface SectionCardsProps {
    title: string,
    videos: VideoI[],
    size: 'large' | 'medium' | 'small',
    shouldWrap?: boolean
}

const SectionCards: FC<SectionCardsProps> = ({title, videos= [], size, shouldWrap= false}) => {

    return (
        <section className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <div className={classes(styles.cardsWrapper, shouldWrap && styles.wrap)}>
                {videos?.map((video, index )=> (
                    <Card
                        imgUrl={video.imgUrl}
                        size={size}
                        id={index}
                        videoId={video.id}
                        key={video.id}
                        noHover={title === 'My List' ? true : false}
                    />
                ))}
            </div>
        </section>
    );
};

export default SectionCards;
