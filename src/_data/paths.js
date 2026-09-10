function normalizePath(p) {
  if (!p || p === "/") return "/";
  let out = String(p).startsWith("/") ? String(p) : "/" + p;
  if (!out.endsWith("/")) out += "/";
  return out;
}

function isEsPath(p) {
  const n = normalizePath(p);
  return n === "/es/" || n.startsWith("/es/");
}

function toEs(p) {
  const n = normalizePath(p);
  if (isEsPath(n)) return n;
  if (n === "/") return "/es/";
  return "/es" + n;
}

function toEn(p) {
  const n = normalizePath(p);
  if (!isEsPath(n)) return n;
  if (n === "/es/") return "/";
  return n.replace(/^\/es/, "") || "/";
}

function alternatePath(p) {
  return isEsPath(p) ? toEn(p) : toEs(p);
}

module.exports = { normalizePath, isEsPath, toEs, toEn, alternatePath };
