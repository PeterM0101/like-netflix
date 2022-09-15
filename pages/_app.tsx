import '../styles/globals.scss'
import type { AppProps } from 'next/app';
import {magic} from "../lib/magic-client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Spinner from "../components/spinner/spinner";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirst, setIsFirst] = useState(false);

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

  useEffect(
      () => {
          (async () => {
            const isLoggedIn = await magic.user.isLoggedIn();
            if (isLoggedIn) {
              // await router.push(window.location.href);
              // if (window.location.pathname !== '/') {
              await router.push('/');
              // }
            } else {
              await router.push("/login");
            }
          })();
      }, []
  )

  return isLoading ? <Spinner /> : <Component {...pageProps} />
}

export default MyApp
