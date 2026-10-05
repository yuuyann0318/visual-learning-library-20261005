(() => {
  'use strict';

  const input = document.querySelector('#chapter-search');
  const result = document.querySelector('#search-result');
  const chapters = [...document.querySelectorAll('.technique')];

  if (!input || !result || chapters.length === 0) return;

  const normalize = (value) => value
    .normalize('NFKC')
    .toLocaleLowerCase('ja-JP')
    .replace(/\s+/g, ' ')
    .trim();

  const haystacks = new Map(
    chapters.map((chapter) => [
      chapter,
      normalize(`${chapter.dataset.search || ''} ${chapter.textContent || ''}`),
    ])
  );

  const update = () => {
    const query = normalize(input.value);
    let visible = 0;

    chapters.forEach((chapter) => {
      const matches = query === '' || haystacks.get(chapter).includes(query);
      chapter.hidden = !matches;
      if (matches) visible += 1;
    });

    result.textContent = query === ''
      ? `${chapters.length}章を表示中`
      : `${visible}章が一致`;
  };

  input.addEventListener('input', update);

  document.addEventListener('keydown', (event) => {
    const tag = document.activeElement?.tagName;
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;

    if (event.key === '/' && !isTyping) {
      event.preventDefault();
      input.focus();
    }

    if (event.key === 'Escape' && document.activeElement === input) {
      input.value = '';
      update();
      input.blur();
    }
  });

  update();
})();
