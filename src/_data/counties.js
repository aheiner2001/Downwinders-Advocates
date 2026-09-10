const path = require("path");
const { loadCsvCollection, writeFlattenReport } = require("../../scripts/load-csv");

const result = loadCsvCollection(path.join(__dirname, "..", "..", "counties.csv"), {
  slugField: "Slug",
});

for (const item of result.items) {
  item.faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${item.Name} covered under RECA?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${item["Coverage Status"]}. ${item["Meta Description"]}`,
        },
      },
      {
        "@type": "Question",
        name: `Which towns are often associated with ${item.Name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: String(item["Key Towns"] || ""),
        },
      },
    ],
  };
}

writeFlattenReport(
  result.flattened,
  path.join(__dirname, "..", "..", "slug-flatten-report.txt")
);

module.exports = result.items;
