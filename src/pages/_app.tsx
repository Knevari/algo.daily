import { type AppType } from "next/dist/shared/lib/utils";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

import "~/styles/globals.css";

import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <SessionProvider session={session}>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default MyApp;
