import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WarpGrep (via @morphllm/morphsdk) transitively pulls in @vscode/ripgrep's
  // native binary even on the GitHub-remote-only code path; bundling it
  // statically breaks Turbopack, so load these as native Node requires instead.
  serverExternalPackages: ["@morphllm/morphsdk", "@vscode/ripgrep"],
};

export default nextConfig;
