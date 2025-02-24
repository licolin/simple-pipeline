// /** @type {import('next').NextConfig} */
// const nextConfig = {};
//
// export default nextConfig;

// next.config.mjs
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, { isServer }) => {
        config.output.globalObject = 'self';
        if (!isServer) {
            config.plugins.push(
                new MonacoWebpackPlugin({
                    languages: [
                        'json',
                        'markdown',
                        'css',
                        'typescript',
                        'javascript',
                        'html',
                        'scss',
                        'less',
                        'python',
                    ],
                    filename: 'static/[name].worker.js',
                })
            );
        }
        return config;
    },
};

export default nextConfig;

