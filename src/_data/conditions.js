const path = require("path");
const { loadCsvCollection } = require("../../scripts/load-csv");

const result = loadCsvCollection(path.join(__dirname, "..", "..", "conditions.csv"), {
  slugField: "Slug",
});

for (const item of result.items) {
  item.faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${item.Name} under RECA?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: String(item["Meta Description"] || ""),
        },
      },
      {
        "@type": "Question",
        name: "Which RECA category applies?",
        acceptedAnswer: {
          "@type": "Answer",
          text: String(item.Category || ""),
        },
      },
    ],
  };
}

module.exports = result.items;
