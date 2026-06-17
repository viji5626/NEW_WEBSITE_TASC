export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = -72; // header height compensation
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset, duration: 1.4 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
