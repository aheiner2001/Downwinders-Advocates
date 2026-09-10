exports.data = {
  pagination: {
    data: "conditionPages",
    size: 1,
    alias: "pageItem",
  },
  permalink: (data) => data.pageItem.permalink,
  layout: "layouts/base.njk",
  eleventyComputed: {
    locale: (data) => data.pageItem.locale,
    title: (data) => data.pageItem.title,
    description: (data) => data.pageItem.description,
    faqJsonLd: (data) => data.pageItem.faqJsonLd,
  },
};

exports.render = function (data) {
  const item = data.pageItem;
  const L = item.locale;
  const t = data.ui[L];
  const prefix = L === "es" ? "/es" : "";
  return `
<section class="sec">
  <div class="wrap stack">
    <h1>${item.name}</h1>
    <div class="rich-text body-content" data-cms-body>
      ${item.body || ""}
    </div>
    <div class="btns">
      <a class="btn" href="${prefix}/check/">${t.ctaCheck}</a>
      <a class="btn btn--ghost" href="${prefix}/free-help/">${t.ctaFreeHelp}</a>
    </div>
  </div>
</section>
`;
};
