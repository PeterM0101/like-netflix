import React, {FC} from 'react';
import styles from '../styles/login.module.scss';
import Head from "next/head";
import Image from "next/image";
import SignIn from "../components/sign-in/sign-in";

interface LoginProps {
}

const Login: FC<LoginProps> = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix SignIn</title>
            </Head>
            <header>
                <div className={styles.headerWrapper}>
                    <a
                        className={styles.logoLink}
                        href="https://netflix.com"
                        target={"_blank"}
                        rel={"noreferrer"}
                    >
                        <Image
                            src="/static/netflix.svg"
                            alt="netflix icon"
                            width="128px"
                            height="34px"
                        />
                    </a>
                </div>
            </header>
            <SignIn />
        </div>
    );
};

export default Login;
