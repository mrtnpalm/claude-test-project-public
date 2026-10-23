const HAIR = {
  naine: { pikk: 'Pikk', bob: 'Bob', pixie: 'Pixie', hobusesaba: 'Hobusesaba', lokid: 'Lokid' },
  mees: { luhike: 'Lühike', siil: 'Siil', undercut: 'Undercut', lokid: 'Lokid', nupp: 'Nupp (man bun)' },
};
const HAIR_COLORS = { must: '#1f1a17', pruun: '#6b3e1f', blond: '#e0b965', punane: '#b5452a', hall: '#a8a8a8', roosa: '#e88bb4' };
const SKIN = { hele: '#f5d6c0', keskmine: '#d9a77f', tume: '#8d5a3b' };
const SHIRT = { valge: '#f2f2f2', must: '#2b2b2b', sinine: '#3b6fd1', roheline: '#3a8f5c', punane: '#c33d3d' };
const GLASSES = { puudub: 'Puudub', umarad: 'Ümarad', kandilised: 'Kandilised', paikesepril: 'Päikeseprillid' };
const BEARD = { puudub: 'Puudub', kore: 'Kõrre', vuntsid: 'Vuntsid', taishabe: 'Täishabe' };

const DEFAULTS = {
  naine: { gender: 'naine', hair: 'pikk', hairColor: 'pruun', skin: 'hele', shirt: 'sinine', glasses: 'puudub', beard: 'puudub' },
  mees: { gender: 'mees', hair: 'luhike', hairColor: 'pruun', skin: 'hele', shirt: 'sinine', glasses: 'puudub', beard: 'puudub' },
};

let state = { ...DEFAULTS.naine };

// --- Avatar drawing ---------------------------------------------------------

function curls(cx, cy, r, from, to, size, color) {
  let out = '';
  for (let a = from; a <= to; a += 18) {
    const rad = (a * Math.PI) / 180;
    out += `<circle cx="${cx + r * Math.cos(rad)}" cy="${cy + r * Math.sin(rad)}" r="${size}" fill="${color}"/>`;
  }
  return out;
}

function hairBack(s, c) {
  if (s.gender === 'naine') {
    if (s.hair === 'pikk') return `<path d="M52 100 Q48 38 100 38 Q152 38 148 100 L156 205 Q100 222 44 205 Z" fill="${c}"/>`;
    if (s.hair === 'bob') return `<path d="M50 100 Q48 38 100 38 Q152 38 150 100 L152 152 Q100 162 48 152 Z" fill="${c}"/>`;
    if (s.hair === 'hobusesaba') return `<path d="M140 70 Q185 90 170 170 Q160 120 138 95 Z" fill="${c}"/>`;
    if (s.hair === 'lokid') return curls(100, 110, 55, 150, 390, 16, c);
  }
  if (s.gender === 'mees' && s.hair === 'lokid') return curls(100, 100, 48, 180, 360, 13, c);
  return '';
}

function hairFront(s, c) {
  const h = s.hair;
  if (s.gender === 'naine') {
    if (h === 'pikk' || h === 'hobusesaba') return `<path d="M55 108 Q50 44 100 44 Q150 44 145 108 Q135 68 100 66 Q65 68 55 108 Z" fill="${c}"/>`;
    if (h === 'bob') return `<path d="M54 110 Q50 42 100 42 Q150 42 146 110 Q140 80 128 82 Q100 86 72 82 Q60 80 54 110 Z" fill="${c}"/>`;
    if (h === 'pixie') return `<path d="M54 100 Q52 44 100 44 Q148 44 146 96 Q130 64 92 76 Q70 72 54 100 Z" fill="${c}"/>`;
    if (h === 'lokid') return curls(100, 92, 44, 190, 350, 14, c);
  } else {
    if (h === 'luhike') return `<path d="M56 96 Q55 48 100 46 Q145 48 144 96 Q140 68 100 66 Q60 68 56 96 Z" fill="${c}"/>`;
    if (h === 'siil') return `<path d="M57 90 Q58 52 100 50 Q142 52 143 90 Q100 62 57 90 Z" fill="${c}" opacity=".75"/>`;
    if (h === 'undercut') return `<path d="M57 92 Q58 70 62 66 L62 92 Z M143 92 Q142 70 138 66 L138 92 Z" fill="${c}" opacity=".45"/><path d="M60 78 Q58 32 112 36 Q152 42 142 78 Q122 58 60 78 Z" fill="${c}"/>`;
    if (h === 'lokid') return curls(100, 88, 42, 195, 345, 12, c);
    if (h === 'nupp') return `<circle cx="100" cy="40" r="16" fill="${c}"/><path d="M56 96 Q55 52 100 50 Q145 52 144 96 Q140 70 100 68 Q60 70 56 96 Z" fill="${c}"/>`;
  }
  return '';
}

function beard(s, c) {
  if (s.gender !== 'mees') return '';
  if (s.beard === 'kore') return `<path d="M60 115 Q62 162 100 166 Q138 162 140 115 Q132 145 100 148 Q68 145 60 115 Z" fill="${c}" opacity=".3"/>`;
  if (s.beard === 'vuntsid') return `<path d="M84 128 Q100 120 116 128 Q100 126 84 128 Z" fill="${c}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`;
  if (s.beard === 'taishabe') return `<path d="M57 108 Q58 172 100 178 Q142 172 143 108 Q136 140 116 132 Q100 124 84 132 Q64 140 57 108 Z" fill="${c}"/>`;
  return '';
}

function glasses(s) {
  const st = 'fill="none" stroke="#222" stroke-width="3"';
  if (s.glasses === 'umarad') return `<circle cx="82" cy="105" r="12" ${st}/><circle cx="118" cy="105" r="12" ${st}/><path d="M94 105 H106" ${st}/>`;
  if (s.glasses === 'kandilised') return `<rect x="68" y="96" width="27" height="18" rx="3" ${st}/><rect x="105" y="96" width="27" height="18" rx="3" ${st}/><path d="M95 104 H105" ${st}/>`;
  if (s.glasses === 'paikesepril') return `<rect x="66" y="96" width="30" height="20" rx="8" fill="#111"/><rect x="104" y="96" width="30" height="20" rx="8" fill="#111"/><path d="M96 104 H104" ${st}/>`;
  return '';
}

function renderAvatar(s) {
  const hc = HAIR_COLORS[s.hairColor];
  const skin = SKIN[s.skin];
  const lips = s.gender === 'naine' ? '#c0505a' : '#8a4a3a';
  const lashes = s.gender === 'naine'
    ? '<path d="M77 103 Q82 99 87 103 M77 103 L73 100 M113 103 Q118 99 123 103 M123 103 L127 100" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/>'
    : '';
  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avatar">
    <rect width="200" height="240" rx="16" fill="#efe9e2"/>
    ${hairBack(s, hc)}
    <path d="M36 240 Q38 186 100 178 Q162 186 164 240 Z" fill="${SHIRT[s.shirt]}"/>
    <rect x="86" y="148" width="28" height="34" rx="10" fill="${skin}"/>
    <ellipse cx="55" cy="110" rx="8" ry="12" fill="${skin}"/>
    <ellipse cx="145" cy="110" rx="8" ry="12" fill="${skin}"/>
    <ellipse cx="100" cy="105" rx="45" ry="56" fill="${skin}"/>
    <path d="M73 92 Q82 87 91 92 M109 92 Q118 87 127 92" stroke="${hc}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="82" cy="105" r="4" fill="#222"/><circle cx="118" cy="105" r="4" fill="#222"/>
    ${lashes}
    <path d="M100 110 Q96 122 102 123" stroke="#00000044" stroke-width="2" fill="none"/>
    ${beard(s, hc)}
    <path d="M88 136 Q100 145 112 136" stroke="${lips}" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${hairFront(s, hc)}
    ${glasses(s)}
  </svg>`;
}

// --- Controls ---------------------------------------------------------------

function pills(key, options) {
  return Object.entries(options)
    .map(([v, label]) => `<button data-key="${key}" data-val="${v}" class="${state[key] === v ? 'on' : ''}">${label}</button>`)
    .join('');
}

function swatches(key, colors) {
  return Object.entries(colors)
    .map(([v, col]) => `<button data-key="${key}" data-val="${v}" title="${v}" aria-label="${v}" class="swatch ${state[key] === v ? 'on' : ''}" style="background:${col}"></button>`)
    .join('');
}

function renderControls() {
  const group = (title, html) => `<div class="group"><h3>${title}</h3><div class="opts">${html}</div></div>`;
  document.getElementById('controls').innerHTML =
    group('Modell', pills('gender', { naine: 'Naine', mees: 'Mees' })) +
    group('Soeng', pills('hair', HAIR[state.gender])) +
    group('Juuksevärv', swatches('hairColor', HAIR_COLORS)) +
    group('Nahatoon', swatches('skin', SKIN)) +
    group('Prillid', pills('glasses', GLASSES)) +
    (state.gender === 'mees' ? group('Habe', pills('beard', BEARD)) : '') +
    group('Särgi värv', swatches('shirt', SHIRT));
}

function render() {
  document.getElementById('avatar').innerHTML = renderAvatar(state);
  renderControls();
}

document.getElementById('controls').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-key]');
  if (!btn) return;
  const { key, val } = btn.dataset;
  if (key === 'gender' && val !== state.gender) {
    state = { ...DEFAULTS[val], hairColor: state.hairColor, skin: state.skin, shirt: state.shirt, glasses: state.glasses };
  } else {
    state[key] = val;
  }
  render();
});

const pick = (obj) => {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
};

document.getElementById('random').addEventListener('click', () => {
  const gender = state.gender;
  state = {
    gender,
    hair: pick(HAIR[gender]),
    hairColor: pick(HAIR_COLORS),
    skin: state.skin,
    shirt: pick(SHIRT),
    glasses: pick(GLASSES),
    beard: gender === 'mees' ? pick(BEARD) : 'puudub',
  };
  render();
});

document.getElementById('reset').addEventListener('click', () => {
  state = { ...DEFAULTS[state.gender] };
  render();
});

// --- Saved looks (Postgres) -------------------------------------------------

const msg = (text) => { document.getElementById('msg').textContent = text; };

function isValidLook(c) {
  return c && HAIR[c.gender] && HAIR[c.gender][c.hair] && HAIR_COLORS[c.hairColor] && SKIN[c.skin] && SHIRT[c.shirt] && GLASSES[c.glasses] && BEARD[c.beard];
}

const escapeHtml = (t) => String(t).replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

async function loadLooks() {
  const box = document.getElementById('saved');
  try {
    const res = await fetch('/api/looks');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    const looks = data.filter((l) => isValidLook(l.config));
    box.innerHTML = looks.length
      ? looks.map((l) => `<div class="look" data-id="${l.id}">
          <button class="del" data-del="${l.id}" title="Kustuta" aria-label="Kustuta">✕</button>
          ${renderAvatar(l.config)}<span>${escapeHtml(l.name)}</span></div>`).join('')
      : '<p style="color:var(--muted)">Salvestatud lookke veel pole.</p>';
    box._looks = Object.fromEntries(looks.map((l) => [l.id, l.config]));
  } catch (err) {
    box.innerHTML = `<p style="color:var(--muted)">${escapeHtml(err.message || 'Lookide laadimine ebaõnnestus.')}</p>`;
  }
}

document.getElementById('saved').addEventListener('click', async (e) => {
  const box = e.currentTarget;
  const del = e.target.closest('[data-del]');
  if (del) {
    if (!confirm('Kas kustutada see look?')) return;
    const res = await fetch(`/api/looks/${del.dataset.del}`, { method: 'DELETE' });
    msg(res.ok ? 'Look kustutatud.' : 'Kustutamine ebaõnnestus.');
    return loadLooks();
  }
  const card = e.target.closest('.look');
  if (card && box._looks[card.dataset.id]) {
    state = { ...box._looks[card.dataset.id] };
    render();
    msg('Look laaditud.');
    document.getElementById('avatar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

async function saveLook() {
  const nameInput = document.getElementById('name');
  const button = document.getElementById('save');
  if (button.disabled) return;
  button.disabled = true;
  try {
    const res = await fetch('/api/looks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameInput.value, config: state }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    nameInput.value = '';
    msg('Look salvestatud! ✓');
    loadLooks();
  } catch (err) {
    msg(err.message || 'Salvestamine ebaõnnestus.');
  } finally {
    button.disabled = false;
  }
}

document.getElementById('save').addEventListener('click', saveLook);
document.getElementById('name').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveLook();
});

render();
loadLooks();
