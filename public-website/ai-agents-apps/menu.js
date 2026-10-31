(() => {
  const destination = '/ai-agents-apps/';
  function connectMenu() {
    const footer = document.querySelector('nav[aria-label="Explore"]');
    if (footer && !footer.querySelector('[data-articles-link]')) { const a=document.createElement("a"); a.href="/articles/"; a.textContent="Articles & Guides"; a.dataset.articlesLink="true"; footer.append(a); }
    for (const nav of document.querySelectorAll('nav[aria-label="Primary"], nav[aria-label="Mobile"], nav[aria-label="Explore"]')) {
      if (nav.querySelector('[data-agent-directory-link]')) continue;
      const link = document.createElement('a');
      link.href = destination;
      link.textContent = 'AI Agents & Apps';
      link.dataset.agentDirectoryLink = 'true';
      if (nav.getAttribute('aria-label') === 'Primary') link.className = 'navbar__link';
      const projects = nav.querySelector('a[href="/projects"]');
      if (projects) projects.after(link); else nav.append(link);
    }
  }
  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; connectMenu(); });
  });
  function start() { connectMenu(); observer.observe(document.body, {childList:true, subtree:true}); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
})();
