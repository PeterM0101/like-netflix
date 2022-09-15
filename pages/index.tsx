import type {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next'
import Head from 'next/head';
import styles from '../styles/Home.module.scss'
import Banner from "../components/banner/banner";
import NavBar from "../components/nav/nav";
import SectionCards from "../components/section-cards/section-cards";
import {getPopularVideos, getVideos, getVideosAndTransform} from "../lib/getVideos";
import {VideoI} from "../model";
import useGetTokenAndUserId from "../lib/useGetTokenAndUserId";
import {getWatchedVideosQuery} from "../lib/db/hasura";

interface HomeProps {
    disneyVideos: VideoI[];
    travelVideos: VideoI[];
    productivityVideos: VideoI[];
    popularVideos: VideoI[];
    watchItAgainVideos: VideoI[]
}

const Home: NextPage<HomeProps> = ({disneyVideos, productivityVideos, popularVideos, travelVideos, watchItAgainVideos}) => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Like a Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className={styles.main}>
            <NavBar />
            <Banner
                title="Clifford the red dog"
                subTitle="a very cute dog"
                imgUrl="/static/red-dog.webp"
                videoId='4zH5iYM4wJo'
            />
            <div className={styles.sectionWrapper}>
                <SectionCards title='Disney' videos={disneyVideos} size='large'/>
                <SectionCards title='Watch It Again' videos={watchItAgainVideos} size='small'/>
                <SectionCards title='Travel' videos={travelVideos} size='small'/>
                <SectionCards title='Productivity' videos={productivityVideos} size='medium'/>
                <SectionCards title='Popular' videos={popularVideos} size='small'/>
            </div>
        </main>
    </div>
  )
}

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

    const disneyVideos: VideoI[] = await getVideos("disney trailer");
    const travelVideos: VideoI[] = await getVideos("travel");
    const productivityVideos: VideoI[] = await getVideos("productivity");
    const popularVideos: VideoI[] = await getPopularVideos();
    let watchItAgainVideos: VideoI[] = await getVideosAndTransform(token!, userId, getWatchedVideosQuery);

    return { props: { disneyVideos, travelVideos, productivityVideos, popularVideos, watchItAgainVideos } }
}

export default Home
