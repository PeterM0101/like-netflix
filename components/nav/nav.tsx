import React, {FC, SyntheticEvent, useEffect, useState} from 'react';
import styles from './nav.module.scss';
import {useRouter} from "next/router";
import Image from "next/image";
import {magic} from "../../lib/magic-client";

const NavBar: FC = () => {
    const [showDropdown, setShowDropDown] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('')
    const [didToken, setDidToken] = useState("");
    const router = useRouter();

    useEffect(() => {

        (async ()=> {
            try {
                const { email } = await magic.user.getMetadata();
                const didToken = await magic.user.getIdToken();
                if (email) {
                    setEmail(email);
                    setDidToken(didToken);
                }
            } catch (error) {
                console.error("Error retrieving email", error);
            }
        })()
    }, []);


    const handleClickLink = async  (path: string, e: SyntheticEvent ) => {
        e.preventDefault()
        await router.push(path)
    }

    const handleOnClick = () => {
        setShowDropDown(prev => !prev);
    }

    const handleSignOut = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/logout",
            //     {
            //     method: "POST",
            //     headers: {
            //         Authorization: `Bearer ${didToken}`,
            //         "Content-Type": "application/json",
            //     },
            // }
            );

            await response.json();
        } catch (error) {
            console.error("Something went wrong!!!", (error as Error).message);
            await router.push("/login");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
            <a
                className={styles.logoLink}
                href="https://netflix.com"
                target={"_blank"}
                rel={"noreferrer"}
            >
                <div className={styles.logoWrapper}>
                    <Image
                        src="/static/netflix.svg"
                        alt="netflix icon"
                        width="128px"
                        height="34px"
                    />
                </div>
            </a>
            <ul className={styles.navItems}>
                <li
                    className={styles.navItem}
                    onClick={(e: SyntheticEvent) => handleClickLink("/", e)}
                >
                    Home
                </li>
                <li
                    className={styles.navItem}
                    onClick={(e: SyntheticEvent) =>
                        handleClickLink("browse/my-list", e)
                    }
                >
                    My list
                </li>
            </ul>
            <nav className={styles.navContainer}>
                <div>
                    <button className={styles.usernameBtn} onClick={handleOnClick}>
                        <p className={styles.userName}>{email ? email : "unknown"}</p>
                        <Image
                            src="/static/expand_more.svg"
                            alt="expand more icon"
                            width={24}
                            height={24}
                            className={styles[showDropdown ? 'isDropDown' : 'isntDropDown']}
                        />
                    </button>
                    {showDropdown && (
                        <div className={styles.navDropdown}>
                                <a className={styles.linkName} onClick={handleSignOut}>
                                    Sign Out
                                </a>
                        </div>
                    )}
                </div>
            </nav>
            </div>
        </div>
    );
};

export default NavBar;
