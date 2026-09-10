exports.data = {
  pagination: {
    data: "counties",
    size: 1,
    alias: "area",
  },
  permalink: (data) => `/covered-areas/${data.area.slug}/`,
  layout: "layouts/base.njk",
  eleventyComputed: {
    title: (data) => data.area["SEO Title"],
    description: (data) => data.area["Meta Description"],
    faqJsonLd: (data) => data.area.faqJsonLd,
  },
};

exports.render = function (data) {
  const area = data.area;
  return `
<section class="sec">
  <div class="wrap stack">
    <h1>${area.Name}</h1>
    <div class="rich-text body-content" data-cms-body>
      ${area.body || ""}
    </div>
    <div class="btns">
      <a class="btn" href="/check/">Check eligibility</a>
      <a class="btn btn--ghost" href="/free-help/">Free help</a>
    </div>
  </div>
</section>
`;
};
