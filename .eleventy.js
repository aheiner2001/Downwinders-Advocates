module.exports = function (eleventyConfig) {
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

  eleventyConfig.addPassthroughCopy({ "src/assets/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/assets/llms.txt": "llms.txt" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "img" });
  // Also at site root so https://…/og-image.jpg matches meta tags / Phase 7
  eleventyConfig.addPassthroughCopy({ "src/assets/img/og-image.jpg": "og-image.jpg" });
  eleventyConfig.addPassthroughCopy({ "src/assets/.nojekyll": ".nojekyll" });

  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    const root = (base || "https://downwindersadvocates.com").replace(/\/$/, "");
    if (!path || path === "/") return root + "/";
    return root + (path.startsWith("/") ? path : "/" + path);
  });

  eleventyConfig.addFilter("jsonLd", (obj) => JSON.stringify(obj));

  // Hardcoded root-absolute href/src need rewriting for GitHub project Pages (/repo/...)
  if (pathPrefix && pathPrefix !== "/") {
    const prefix = pathPrefix.replace(/\/$/, "");
    eleventyConfig.addTransform("prefixRootPaths", (content, outputPath) => {
      if (!outputPath || !outputPath.endsWith(".html")) return content;
      return content.replace(/(href|src)="\/(?!\/)/g, `$1="${prefix}/`);
    });
  }

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix,
  };
};
