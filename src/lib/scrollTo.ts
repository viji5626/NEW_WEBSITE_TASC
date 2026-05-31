export function scrollToId(id: string, attempts = 0, previousTargetTop = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  
  const targetTop = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: targetTop, behavior: "smooth" });

  if (attempts < 5) {
    setTimeout(() => {
      const currentTargetTop = el.getBoundingClientRect().top + window.scrollY - 72;
      // If the delta is significant, scroll again
      if (Math.abs(currentTargetTop - targetTop) > 10) {
        scrollToId(id, attempts + 1, currentTargetTop);
      }
    }, 500); 
  }
}

