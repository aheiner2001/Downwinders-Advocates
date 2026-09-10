const conditions = require("./conditions");

module.exports = conditions.flatMap((condition) => {
  const en = {
    locale: "en",
    permalink: `/conditions/${condition.slug}/`,
    name: condition.Name,
    title: condition["SEO Title"],
    description: condition["Meta Description"],
    body: condition.body || "",
    faqJsonLd: condition.faqJsonLd,
  };
  const es = {
    locale: "es",
    permalink: `/es/conditions/${condition.slug}/`,
    name: condition["Name ES"] || condition.Name,
    title: condition["SEO Title ES"] || condition["SEO Title"],
    description: condition["Meta Description ES"] || condition["Meta Description"],
    body: condition.body || "",
    faqJsonLd: condition.faqJsonLd
      ? {
          ...condition.faqJsonLd,
          mainEntity: (condition.faqJsonLd.mainEntity || []).map((q) => ({
            ...q,
            name: q.name,
            acceptedAnswer: {
              ...q.acceptedAnswer,
              text: condition["Meta Description ES"] || q.acceptedAnswer.text,
            },
          })),
        }
      : undefined,
  };
  return [en, es];
});
