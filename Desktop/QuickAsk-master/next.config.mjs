/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        source: '/v1/complete',
        headers: [
          {
            key: 'Referer',
            value: 'http://127.0.0.1/',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer'
          }
        ],
      },
    ]
  },

  async rewrites() {
    const ret = [
      {
        source: "/v1/complete/:path*",
        destination: "https://api.openai.com/:path*",
      },
      {
        source: "/google-fonts/:path*",
        destination: "https://fonts.googleapis.com/:path*",
      },
      {
        source: "/sharegpt",
        destination: "https://sharegpt.com/api/conversations",
      },
    ];

    const apiUrl = process.env.API_URL;
    if (apiUrl) {
      console.log("[Next] using api url ", apiUrl);
      ret.push({
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      });
    }

    return {
      beforeFiles: ret,
    };
  },
  webpack(config, {isServer}) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    }, 
    {
      test: /\.md$/,
      use: 'raw-loader',
    },
    {
      test: /LICENSE$/,
      use: 'raw-loader',
    });

    return config;
  },
  output: "standalone",
};

export default nextConfig;
