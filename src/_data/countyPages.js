const counties = require("./counties");

module.exports = counties.flatMap((area) => {
  const en = {
    locale: "en",
    permalink: `/covered-areas/${area.slug}/`,
    name: area.Name,
    title: area["SEO Title"],
    description: area["Meta Description"],
    body: area.body || "",
    faqJsonLd: area.faqJsonLd,
  };
  const es = {
    locale: "es",
    permalink: `/es/covered-areas/${area.slug}/`,
    name: area["Name ES"] || area.Name,
    title: area["SEO Title ES"] || area["SEO Title"],
    description: area["Meta Description ES"] || area["Meta Description"],
    body: area.body || "",
    faqJsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `¿${area["Name ES"] || area.Name} está cubierto por RECA?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${area["Coverage Status"]}. ${area["Meta Description ES"] || area["Meta Description"]}`,
          },
        },
      ],
    },
  };
  return [en, es];
});
