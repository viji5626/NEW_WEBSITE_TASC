export function scrollToId(id: string, attempts = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  
  if ((window as any).lenis) {
    (window as any).lenis.scrollTo(el, { offset: -72 });
  } else {
    const targetTop = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }

  // Layout shifts might occur due to images loading or scroll reveal animations.
  // We incrementally correct the scroll target.
  if (attempts < 5) {
    setTimeout(() => {
      scrollToId(id, attempts + 1);
    }, 250);
  }
}

export function scrollToTop(immediate = false) {
  if (immediate) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  if ((window as any).lenis) {
    if (immediate) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      (window as any).lenis.scrollTo(0);
    }
  }
}

