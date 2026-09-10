exports.data = {
  pagination: {
    data: "conditions",
    size: 1,
    alias: "condition",
  },
  permalink: (data) => `/conditions/${data.condition.slug}/`,
  layout: "layouts/base.njk",
  eleventyComputed: {
    title: (data) => data.condition["SEO Title"],
    description: (data) => data.condition["Meta Description"],
    faqJsonLd: (data) => data.condition.faqJsonLd,
  },
};

exports.render = function (data) {
  const condition = data.condition;
  return `
<section class="sec">
  <div class="wrap stack">
    <p class="eyebrow">${condition.Category}</p>
    <h1>${condition.Name}</h1>
    <p class="lede">${condition["Meta Description"]}</p>
    <div class="rich-text body-content" data-cms-body>
      ${condition.body || ""}
    </div>
    <div class="btns">
      <a class="btn" href="/check/">Check eligibility</a>
      <a class="btn btn--ghost" href="/free-help/">Free help</a>
    </div>
  </div>
</section>
`;
};
