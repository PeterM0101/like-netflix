import React, {FC} from 'react';
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import useGetTokenAndUserId from "../../lib/useGetTokenAndUserId";
import {VideoI} from "../../model";
import {getMyListVideosQuery} from "../../lib/db/hasura";
import NavBar from "../../components/nav/nav";
import styles from "../../styles/My-list.module.scss";
import SectionCards from "../../components/section-cards/section-cards";
import {getVideosAndTransform} from "../../lib/getVideos";
import Head from "next/head";

interface MyListProps {
    myListVideos: any[]
}

const MyList: FC<MyListProps> = ({myListVideos}) => {

    return (
        <div className={styles.container}>
            <Head>
                <title>My List</title>
            </Head>
            <main>
                <NavBar />
                <div className={styles.sectionWrapper}>
                    <SectionCards
                        title='My List'
                        videos={myListVideos}
                        size='small'
                        shouldWrap={true}
                    />
                </div>
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {token, userId} = await useGetTokenAndUserId(context);

    if (!userId) {
        return {
            redirect: {
                props: {},
                destination: '/login',
                permanent: false,
            },
        }
    }

    let myListVideos: VideoI[] = await getVideosAndTransform(token!, userId, getMyListVideosQuery);

    return {
        props: {
            myListVideos
        }
    }
}

export default MyList;
