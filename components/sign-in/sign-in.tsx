import React, {FC, FormEvent, useEffect, useRef, useState} from 'react';
import styles from './sign-in.module.scss';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useRouter} from "next/router";
import { magic } from "../../lib/magic-client";
import Loader from "../../utils/loader/loader";

interface SignInProps {
}

const SignIn: FC<SignInProps> = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const handleRouteChangeComplete = () => {
            setIsLoading(false);
        };

        router.events.on("routeChangeComplete", handleRouteChangeComplete);
        router.events.on("routeChangeError", handleRouteChangeComplete);

        return () => {
            router.events.off("routeChangeComplete", handleRouteChangeComplete);
            router.events.off("routeChangeError", handleRouteChangeComplete);
        };
    }, [router]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = emailRef.current?.value;
        if (email?.trim()) {
            try {
                setIsLoading(true);
                const didToken = await magic.auth.loginWithMagicLink({ email });
                console.log({didToken})
                if (didToken) {
                    const response = await fetch('api/login', {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${didToken}`,
                            "Content-Type": "application/json",
                        }
                    })
                    const loggedInResponse = await response.json();
                    console.log({loggedInResponse})
                    if (loggedInResponse?.done) {
                        // (e.target as HTMLFormElement).reset();
                        await router.push('/')
                    } else {
                        setIsLoading(false)
                        toast.error("Something went wrong ");
                    }
                }
            } catch(error) {
                toast.error(`Something went wrong ${(error as Error).message}`);
            }
        } else {
            toast.error("Your credentials are not valid")
        }
    }

    return (
        <div className={styles.signIn}>
            <ToastContainer />
            <div className={styles.signInWrapper}>
                <h1 className={styles.signInHeader}>Sign In</h1>
                <form onSubmit={handleSubmit} autoComplete={"on"}>
                    <input
                        type="email"
                        required
                        className={styles.emailInput}
                        ref={emailRef}
                        placeholder="Email address"
                    />
                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader /> : "Sigh In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
