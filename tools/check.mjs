// Vérifie les données et construit chaque exercice pour chaque élément : node tools/check.mjs [-v]
// (store.js a besoin de localStorage : on le simule.)
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
const { units } = await import('../js/units/index.js');
const { EXERCISES, MODES } = await import('../js/exercises/index.js');
const { initStore } = await import('../js/core/store.js');
const { VOCAB } = await import('../js/data/vocab.js');
initStore(units);

const verbose = process.argv.includes('-v');
let errors = 0;
const err = (...a) => { errors++; if (errors < 60) console.log('✗', ...a); };

// Emojis du vocabulaire : uniques
const seen = new Map();
for (const w of VOCAB) {
  if (seen.has(w.emoji)) err('emoji en double dans vocab', w.emoji, w.en, seen.get(w.emoji));
  seen.set(w.emoji, w.en);
}

const ids = new Map();
for (const u of units) {
  // Ids uniques, emojis uniques par univers (hors notions spéciales)
  const emo = new Map();
  for (const s of u.skills) {
    for (const it of s.items) {
      if (ids.has(it.id) && ids.get(it.id) !== it) err('id en double', it.id);
      ids.set(it.id, it);
      if (!it.en) err('élément sans anglais', it.id);
      if (it.kind === 'emoji') {
        if (emo.has(it.emoji) && emo.get(it.emoji) !== it.id) err(u.id, 'emoji en double', it.emoji, it.id, emo.get(it.emoji));
        emo.set(it.emoji, it.id);
      }
    }
  }
  for (const m of u.modes) if (!MODES[m]) err(u.id, 'mode inconnu', m);
  for (const m of u.reviewModes) if (!EXERCISES[m]) err(u.id, 'exercice de révision inconnu', m);

  const modeIds = [...new Set([...u.modes.filter((m) => EXERCISES[m]), ...u.skills.flatMap((s) => s.exercises || u.reviewModes)])];
  for (const modeId of modeIds) {
    const ex = EXERCISES[modeId];
    let ok = 0;
    let nul = 0;
    const samples = [];
    for (const skill of u.skills) {
      const ctx = { unit: u, skill, skills: [skill], pool: skill.items };
      for (const item of skill.items) {
        for (let r = 0; r < 6; r++) {
          let q;
          try {
            q = ex.build(item, ctx);
          } catch (e) {
            err(modeId, item.id, 'plantage', e.message);
            break;
          }
          if (!q) { nul++; break; }
          ok++;
          if (!q.instruction) err(modeId, item.id, 'pas de consigne');
          if (!q.correction) err(modeId, item.id, 'pas de correction');
          if (q.input === 'choices') {
            const vals = q.choices.map((c) => c.value);
            if (!vals.includes(q.answer)) err(modeId, item.id, 'réponse absente', vals);
            if (new Set(vals).size !== vals.length) err(modeId, item.id, 'choix en double', vals);
            const looks = q.choices.map((c) => JSON.stringify(c.visual) + (c.text || ''));
            if (new Set(looks).size !== looks.length) err(modeId, item.id, 'deux choix identiques à l’écran', looks);
            if (q.choices.length < 2) err(modeId, item.id, 'un seul choix');
          }
          if (q.input === 'tiles') {
            const pool = [...q.tiles];
            for (const a of q.answer) { const i = pool.indexOf(a); if (i < 0) err(modeId, item.id, 'étiquette manquante', a); else pool.splice(i, 1); }
          }
          if (q.input === 'truefalse' && typeof q.answer !== 'boolean') err(modeId, item.id, 'réponse oui/non invalide');
          const flat = JSON.stringify({ ...q, item: null });
          if (/undefined|NaN|\{name\}|\{age\}/.test(flat.replace(/"[a-zA-Z]+":undefined/g, ''))) err(modeId, item.id, 'texte incomplet', flat.match(/.{30}(undefined|NaN|\{name\}|\{age\}).{10}/)?.[0]);
          if (r === 0 && samples.length < 4) {
            const ch = q.choices ? q.choices.map((c) => c.text || c.visual?.emoji || c.visual?.emojis || c.visual?.color || (c.visual?.num ?? c.visual?.scene?.pos)).join(' / ') : q.tiles ? q.tiles.join(' ') : String(q.answer);
            samples.push(`${typeof q.say === 'string' ? '🔊 ' + q.say : ''} ${q.text ? '[' + q.text + ']' : ''} → ${ch}  ✓${Array.isArray(q.answer) ? q.answer.join(' ') : q.answer}${q.afterOk ? '  « ' + q.afterOk + ' »' : ''}`);
          }
        }
      }
    }
    console.log(`${u.id}/${modeId}: ${ok} questions, ${nul} éléments non adaptés`);
    if (verbose) for (const s of samples) console.log('    ', s);
  }
}
// Tous les fichiers livrés sont dans le cache hors-ligne (sw.js)
const { readFileSync, readdirSync } = await import('node:fs');
const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const walk = (d) => readdirSync(new URL(`../${d}`, import.meta.url), { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? walk(`${d}/${f.name}`) : [`${d}/${f.name}`]));
for (const f of walk('js')) if (!sw.includes(`'${f}'`)) err('fichier absent de sw.js (ASSETS)', f);

for (const u of units) console.log(`${u.emoji} ${u.id}: ${u.skills.length} notions, ${u.skills.reduce((n, s) => n + s.items.length, 0)} éléments`);
console.log(errors ? `\n${errors} erreur(s)` : '\nAucune erreur ✔');
process.exit(errors ? 1 : 0);
