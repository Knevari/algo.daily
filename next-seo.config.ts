export default {
    title: "AlgoDaily - Master Algorithms & Data Structures Daily",
    titleTemplate: "%s | AlgoDaily",
    defaultTitle: "AlgoDaily - Master Algorithms & Data Structures Daily",
    description: "The daily habit for mastering technical interviews. Solve one algorithm problem every day, build your streak, and land your dream job at FAANG.",
    canonical: "https://algodaily.app",
    openGraph: {
        type: "website",
        locale: "en_IE",
        url: "https://algodaily.app/",
        siteName: "AlgoDaily",
        images: [
            {
                url: "https://algodaily.app/og-image.png",
                width: 1200,
                height: 630,
                alt: "AlgoDaily Dashboard Preview",
            },
        ],
    },
    twitter: {
        handle: "@algodailyapp",
        site: "@algodailyapp",
        cardType: "summary_large_image",
    },
    additionalLinkTags: [
        {
            rel: "icon",
            href: "/favicon.ico",
        },
        {
            rel: "manifest",
            href: "/manifest.json",
        },
    ],
};
