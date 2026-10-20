(function () {
  const fmtPrice = (n) => n.toLocaleString('ru-RU') + ' руб.';
  const byId = (id) => CATALOG.find((i) => i.id === id);

  /* ---------- Каталог ---------- */
  const catalogEl = document.querySelector('[data-catalog]');
  const filtersEl = document.querySelector('[data-filters]');
  let activeFilter = 'all';

  function renderFilters() {
    filtersEl.innerHTML = CATEGORIES.map(
      (c) => `<button type="button" class="filter${c.id === activeFilter ? ' is-active' : ''}" data-filter="${c.id}">${c.label}</button>`
    ).join('');
  }

  function renderCatalog() {
    const items = activeFilter === 'all' ? CATALOG : CATALOG.filter((i) => i.category === activeFilter);
    if (!items.length) {
      catalogEl.innerHTML = '<p class="cards__empty">Пока пусто</p>';
      return;
    }
    catalogEl.innerHTML = items.map((item, idx) => `
      <article class="card" style="animation-delay:${idx * 50}ms">
        <div class="card__img"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>
        <div class="card__body">
          <h3 class="card__title">${item.title} <small>(${item.age})</small></h3>
          <p class="card__descr">${item.description}</p>
          <p class="card__meta">
            <span class="card__price">${fmtPrice(item.price)}</span>${item.priceNote ? ' ' + item.priceNote : ''} / ${item.duration}
          </p>
          <button type="button" class="btn btn--ghost card__btn" data-open-modal data-item="${item.id}">Записаться</button>
        </div>
      </article>`).join('');
  }

  function setFilter(id) {
    activeFilter = id;
    renderFilters();
    renderCatalog();
  }

  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (btn) setFilter(btn.dataset.filter);
  });

  document.querySelectorAll('[data-filter-link]').forEach((a) => {
    a.addEventListener('click', () => {
      setFilter(a.dataset.filterLink);
      closeNav();
    });
  });

  renderFilters();
  renderCatalog();

  /* ---------- Галерея ---------- */
  const galleryEl = document.querySelector('[data-gallery]');
  const rotations = [-4, 3, -2, 4, -3, 2];
  galleryEl.innerHTML = GALLERY.map(
    (src, i) => `<figure class="polaroid" style="--rot:${rotations[i % rotations.length]}deg"><img src="${src}" alt="Работа ${i + 1}" loading="lazy"></figure>`
  ).join('');

  /* ---------- FAQ ---------- */
  const faqEl = document.querySelector('[data-faq]');
  faqEl.innerHTML = FAQ.map((f) => `
    <div class="faq__item">
      <button type="button" class="faq__q" aria-expanded="false">${f.q}</button>
      <div class="faq__a"><p>${f.a}</p></div>
    </div>`).join('');
  faqEl.addEventListener('click', (e) => {
    const q = e.target.closest('.faq__q');
    if (!q) return;
    const item = q.parentElement;
    const answer = item.querySelector('.faq__a');
    const open = item.classList.toggle('is-open');
    q.setAttribute('aria-expanded', open);
    answer.style.maxHeight = open ? answer.scrollHeight + 'px' : 0;
  });

  /* ---------- Команда ---------- */
  document.querySelector('[data-team]').innerHTML = TEAM.map((m) => `
    <div class="member">
      <img src="${m.image}" alt="${m.name}" loading="lazy">
      <div class="member__body">
        <div class="member__name">${m.name}</div>
        <div class="member__role">${m.role}</div>
      </div>
    </div>`).join('');

  /* ---------- Формы ---------- */
  document.querySelectorAll('[data-form-item]').forEach((select) => {
    CATALOG.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = `${item.title} — ${fmtPrice(item.price)}`;
      select.appendChild(opt);
    });
  });

  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      form.innerHTML = `
        <div class="form__success">
          <div class="form__success-title">Спасибо!</div>
          <p>${name ? name + ', мы' : 'Мы'} свяжемся с вами в течение дня.<br>А пока подписывайтесь на наш <a href="https://t.me/" target="_blank" rel="noopener" style="color:var(--teal);font-weight:600">Telegram-канал</a>.</p>
        </div>`;
    });
  });

  /* ---------- Модалка ---------- */
  const modal = document.querySelector('[data-modal]');
  const modalSelect = modal.querySelector('[data-form-item]');
  const modalTitle = modal.querySelector('#modalTitle');

  function openModal(itemId) {
    if (itemId && modalSelect) {
      modalSelect.value = itemId;
      const item = byId(itemId);
      if (item && modalTitle) modalTitle.textContent = 'Записаться: ' + item.title;
    } else if (modalTitle) {
      modalTitle.textContent = 'Записаться';
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const first = modal.querySelector('input');
    if (first) first.focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-modal]');
    if (openBtn) { openModal(openBtn.dataset.item); return; }
    if (e.target.closest('[data-close-modal]')) closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Мобильное меню ---------- */
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');
  function closeNav() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));

  /* ---------- Подсветка активного пункта меню ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...nav.querySelectorAll('a')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => observer.observe(s));

  document.querySelector('[data-year]').textContent = new Date().getFullYear();
})();
