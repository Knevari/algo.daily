import { type AppType } from "next/dist/shared/lib/utils";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default MyApp;
