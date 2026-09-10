const path = require("path");
const { loadCsvCollection } = require("./load-csv");

const counties = loadCsvCollection(path.join(__dirname, "..", "counties.csv"), {
  slugField: "Slug",
});
const conditions = loadCsvCollection(path.join(__dirname, "..", "conditions.csv"), {
  slugField: "Slug",
});

if (counties.items.length !== 19) throw new Error("expected 19 counties, got " + counties.items.length);
if (conditions.items.length !== 17) throw new Error("expected 17 conditions, got " + conditions.items.length);

const coconino = counties.items.find((r) => r.slug === "arizona-coconino-county");
if (!coconino) throw new Error("missing flattened arizona-coconino-county");
if (coconino.originalSlug !== "arizona/coconino-county") throw new Error("originalSlug mismatch");
if (coconino.body !== "") throw new Error("body must be empty string");

const slashLeft = counties.items.some((r) => r.slug.includes("/"));
if (slashLeft) throw new Error("flattened slug still contains slash");

if (counties.flattened.length < 1) throw new Error("expected at least one flattened slug report entry");

console.log("PASS load-csv");
