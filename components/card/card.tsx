import React, {FC, useState} from 'react';
import Image from "next/image";
import styles from './card.module.scss';
import { motion } from "framer-motion";
import classes from 'classnames';
import Link from "next/link";

interface CardProps {
    imgUrl: string,
    size: 'large' | 'medium' | 'small',
    id: number;
    videoId: string,
    noHover?: boolean
}

const Card: FC<CardProps> = ({imgUrl, size, id, videoId, noHover= false}) => {
    const [imageSrc, setImageSrc] = useState<string>(imgUrl);
    const classMap = {
        large: styles.lgItem,
        medium: styles.mdItem,
        small: styles.smItem,
    };
    const scaleRule = id === 0 ? {scaleY: 1.1 }: {scale: 1.1}
    const shouldHover = !noHover && {whileHover: scaleRule}

    const  handleOnError = () => {
        setImageSrc(
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3518&q=80"
        );
    }

    return (
        <Link href={`/video/${videoId}`} className={styles.container} >
            <motion.div
                className={classes(classMap[size], styles.imgMotionWrapper)}
                {...shouldHover}
            >
                <Image src={imageSrc}
                       alt="awesome movie"
                       layout="fill"
                       className={styles.cardImg}
                       onError={handleOnError}
                />
            </motion.div>
        </Link>
    );
};

export default Card;
