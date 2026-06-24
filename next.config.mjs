/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      { source: '/odds',     destination: '/intelligence', permanent: true },
      { source: '/leagues',  destination: '/rankings',     permanent: true },
      { source: '/articles', destination: '/insights',     permanent: true },
    ];
  },
};

export default nextConfig;
