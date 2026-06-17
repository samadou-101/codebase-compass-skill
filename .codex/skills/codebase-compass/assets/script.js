/* Codebase-Compass Dashboard Script */

(function () {
  'use strict';

  const TOPIC_LIST = document.getElementById('topic-list');
  const SECTION_CONTAINER = document.getElementById('section-container');
  const THEME_TOGGLE = document.getElementById('theme-toggle');
  const REPO_TITLE = document.getElementById('repo-title');

  function getStoredTheme() {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    THEME_TOGGLE.textContent = theme === 'dark' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    try {
      localStorage.setItem('theme', theme);
    } catch { /* ignore */ }
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
  }

  async function fetchManifest() {
    try {
      const res = await fetch('manifest.json');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function sortEntries(manifest) {
    return Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b));
  }

  function renderSidebar(entries) {
    TOPIC_LIST.innerHTML = '';
    for (const [key, meta] of entries) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + key;
      a.textContent = meta.title || key;
      a.dataset.topic = key;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        loadSection(key, meta);
      });
      li.appendChild(a);
      TOPIC_LIST.appendChild(li);
    }
  }

  function setActive(topicKey) {
    const links = TOPIC_LIST.querySelectorAll('li a');
    links.forEach((a) => {
      const li = a.parentElement;
      if (a.dataset.topic === topicKey) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    });
  }

  async function loadSection(topicKey, meta) {
    setActive(topicKey);
    if (!meta.html) {
      SECTION_CONTAINER.innerHTML =
        '<p style="color:var(--text-muted);">No HTML section available for this topic.</p>';
      return;
    }
    try {
      const res = await fetch(meta.html);
      if (!res.ok) {
        SECTION_CONTAINER.innerHTML =
          '<p style="color:var(--text-muted);">Failed to load section.</p>';
        return;
      }
      const html = await res.text();
      SECTION_CONTAINER.innerHTML = html;
      renderMermaidDiagrams();
    } catch {
      SECTION_CONTAINER.innerHTML =
        '<p style="color:var(--text-muted);">Failed to load section.</p>';
    }
  }

  function renderMermaidDiagrams() {
    const mermaidBlocks = SECTION_CONTAINER.querySelectorAll('code.language-mermaid');
    if (mermaidBlocks.length === 0) return;
    if (typeof mermaid === 'undefined') return;
    mermaidBlocks.forEach((block, i) => {
      const pre = block.parentElement;
      const container = document.createElement('div');
      container.classList.add('mermaid');
      container.id = 'mermaid-' + i;
      pre.replaceWith(container);
      mermaid.render('mermaid-svg-' + i, block.textContent).then(({ svg }) => {
        container.innerHTML = svg;
      });
    });
  }

  async function init() {
    setTheme(getStoredTheme());
    THEME_TOGGLE.addEventListener('click', toggleTheme);

    const manifest = await fetchManifest();
    if (!manifest || Object.keys(manifest).length === 0) {
      SECTION_CONTAINER.innerHTML =
        '<p style="color:var(--text-muted);">No topics found. Run <code>/codebase-compass &lt;topic&gt;</code> to generate content.</p>';
      return;
    }

    const entries = sortEntries(manifest);
    renderSidebar(entries);

    if (entries.length > 0) {
      const [firstKey, firstMeta] = entries[0];
      loadSection(firstKey, firstMeta);
    }
  }

  init();
})();
