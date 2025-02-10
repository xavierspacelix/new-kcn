/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    pageExtensions: ['tsx'],
    webpack: (config, { dev }) => {
        config.optimization.minimize = false;
        return config;
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
