/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "wandering-okapi-896.convex.cloud",
				pathname: "/api/storage/**", // Allow all under /api/storage
			},
			{
				protocol: "https",
				hostname: "oaidalleapiprodscus.blob.core.windows.net",
				pathname: "/**", // Allow all paths
			},
		],
	},
};

export default nextConfig;
