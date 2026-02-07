const ensureMeta = (name, attr = 'name') => {
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  return tag;
};

export const setMeta = ({ title, description, image, url }) => {
  if (title) {
    document.title = title;
    ensureMeta('og:title', 'property').setAttribute('content', title);
    ensureMeta('twitter:title').setAttribute('content', title);
  }
  if (description) {
    ensureMeta('description').setAttribute('content', description);
    ensureMeta('og:description', 'property').setAttribute('content', description);
    ensureMeta('twitter:description').setAttribute('content', description);
  }
  if (image) {
    ensureMeta('og:image', 'property').setAttribute('content', image);
    ensureMeta('twitter:image').setAttribute('content', image);
  }
  if (url) {
    ensureMeta('og:url', 'property').setAttribute('content', url);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }
};

export const setJsonLd = (id, json) => {
  const scriptId = `jsonld-${id}`;
  let script = document.getElementById(scriptId);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(json);
};
