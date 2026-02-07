/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXTAUTH_URL || 'https://algodaily.app',
    generateRobotsTxt: true,
    exclude: ['/api/*', '/auth/*', '/settings/*'], // Exclude private pages
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api', '/auth', '/settings'],
            },
        ],
    },
}
