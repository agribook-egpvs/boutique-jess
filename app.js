const SB_URL = "https://blnbhxhevliejjwqphxr.supabase.co";
const SB_KEY = "sb_publishable_z0H1Ad9Kj1QG6CdFltMrcA_D8IO-FhZ";
const SHOP = "Ma Boutique";

const H = SB_KEY.startsWith("sb_") ? { apikey: SB_KEY } : { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY };
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => Number(n).toLocaleString("fr-FR") + " FCFA";
const stars = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
async function sbGet(path) {
  const r = await fetch(SB_URL + "/rest/v1/" + path, { headers: H });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}
function sbPost(table, body) {
  return fetch(SB_URL + "/rest/v1/" + table, {
    method: "POST", keepalive: true,
    headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(body)
  }).catch(() => {});
}
// Transmet les paramètres de la pub (utm, fbclid) vers Chariow
function buyUrl(url) {
  try {
    const u = new URL(url);
    new URLSearchParams(location.search).forEach((v, k) => { if (/^(utm_|fbclid|ttclid)/.test(k)) u.searchParams.set(k, v); });
    return u.toString();
  } catch (e) { return url; }
}
function bindLeads() {
  document.querySelectorAll(".lead-form").forEach(f => f.addEventListener("submit", async e => {
    e.preventDefault();
    const email = f.email.value.trim();
    await sbPost("leads", { email, source: location.pathname + location.search });
    f.innerHTML = "<p><strong>Merci !</strong> Tu recevras nos prochains guides par e‑mail.</p>";
  }));
}
function card(p) {
  const cover = p.cover_url ? `<img src="${esc(p.cover_url)}" alt="" loading="lazy">` : `<div class="ph">${esc(p.title)}</div>`;
  return `<a class="pcard" href="produit.html?slug=${encodeURIComponent(p.slug)}">
    <div class="pimg">${cover}</div>
    <div class="pbody"><span class="tag">${esc(p.category)}</span><h3>${esc(p.title)}</h3>
    <div class="rt"><span class="st">${stars(p.rating)}</span> ${Number(p.rating).toFixed(1)} (${p.reviews_count})</div>
    <div class="pp"><strong>${money(p.price)}</strong>${p.old_price ? `<s>${money(p.old_price)}</s>` : ""}</div></div></a>`;
}
