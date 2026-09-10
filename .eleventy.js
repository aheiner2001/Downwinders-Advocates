module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/assets/llms.txt": "llms.txt" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });

  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    const root = (base || "https://downwindersadvocates.com").replace(/\/$/, "");
    if (!path || path === "/") return root + "/";
    return root + (path.startsWith("/") ? path : "/" + path);
  });

  eleventyConfig.addFilter("jsonLd", (obj) => JSON.stringify(obj));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/",
  };
};
