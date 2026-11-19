// Espace parents : choix des notions, réglages, voix, suivi des progrès, sauvegarde.

import { h } from '../ui/dom.js';
import { getState, update, save, resetProgress, exportData, importData } from '../core/store.js';
import { units } from '../units/index.js';
import { factStat, masteryOf } from '../core/srs.js';
import { MODES } from '../exercises/index.js';
import { header } from '../ui/components.js';
import { speak, speechAvailable, hasVoice, voiceName, pickVoices } from '../ui/speech.js';

export default function parent() {
  const body = h('div', { class: 'parent-body' });
  const el = h('div', { class: 'screen parent' }, header('Espace parents', { right: null }), body);

  const section = (title, ...kids) => h('section', { class: 'panel' }, h('h2', {}, title), ...kids);

  const switchRow = (label, checked, onChange, note) =>
    h(
      'label',
      { class: 'switch-row' },
      h('span', {}, label, note ? h('small', {}, note) : null),
      h('input', { type: 'checkbox', class: 'switch', checked, onchange: (e) => onChange(e.target.checked) })
    );

  const selectRow = (label, value, values, fmt, onChange) =>
    h(
      'label',
      { class: 'switch-row' },
      h('span', {}, label),
      h('select', { onchange: (e) => onChange(e.target.value) }, values.map((v) => h('option', { value: v, selected: v === value }, fmt(v))))
    );

  function render() {
    const y = window.scrollY;
    const st = getState();
    const S = st.settings;

    const unitSections = units.map((u) => {
      const conf = S.units[u.id];
      const has = (id) => conf.skills.includes(id);
      const toggle = (id, on) => update(() => (conf.skills = on ? [...new Set([...conf.skills, id])] : conf.skills.filter((x) => x !== id)));
      const groups = (u.families || []).map((f) => {
        const skills = u.skills.filter((s) => s.family === f.id);
        return h(
          'div',
          { class: 'family' },
          h('h3', {}, `${f.emoji} ${f.label}`),
          h(
            'div',
            { class: 'chips' },
            skills.map((s) =>
              h(
                'button',
                {
                  class: 'chip' + (has(s.id) ? ' on' : ''),
                  'aria-pressed': String(has(s.id)),
                  title: `${s.parentInfo || s.desc || s.label} (${s.items.length} éléments)`,
                  onclick: () => {
                    toggle(s.id, !has(s.id));
                    render();
                  },
                },
                `${s.emoji} ${s.short}`
              )
            )
          )
        );
      });
      const sec = section(
        `${u.emoji} ${u.name}`,
        h('p', { class: 'muted' }, 'Touchez une notion pour l’activer ou la désactiver. L’enfant ne voit que les notions actives. (Survolez pour le détail.)'),
        groups,
        h(
          'div',
          { class: 'row left' },
          h('button', { class: 'btn small ghost', onclick: () => { update(() => (conf.skills = u.skills.map((s) => s.id))); render(); } }, 'Tout'),
          h('button', { class: 'btn small ghost', onclick: () => { update(() => (conf.skills = [])); render(); } }, 'Rien')
        )
      );
      sec.classList.add(`theme-${u.id}`);
      return sec;
    });

    const progressSections = units.map((u) => {
      const rows = u.skills
        .filter((s) => s.items.some((i) => factStat(st, i.id).seen))
        .map((s) =>
          h(
            'details',
            { class: 'heat-row' },
            h('summary', { class: 'heat-label' }, s.short || s.label, h('small', {}, ` ${Math.round(masteryOf(st, s.items) * 100)} % su`)),
            h(
              'div',
              { class: 'heat-cells' },
              s.items.map((i) => {
                const fs = factStat(st, i.id);
                return h('span', { class: `heat-word b${fs.box}`, title: `${i.fr || ''} — ${fs.ok} ✓ / ${fs.ko} ✗` }, i.answer || i.en);
              })
            )
          )
        );
      const hard = u.skills
        .flatMap((s) => s.items)
        .filter((i, k, a) => a.indexOf(i) === k)
        .map((i) => ({ i, s: factStat(st, i.id) }))
        .filter((x) => x.s.ko > 0)
        .sort((a, b) => b.s.ko - a.s.ko || a.s.box - b.s.box)
        .slice(0, 10);
      return h(
        'div',
        { class: 'progress-op' },
        h('h3', {}, `${u.emoji} ${u.name}`),
        rows.length ? rows : h('p', { class: 'muted' }, 'Pas encore de données.'),
        hard.length
          ? h('div', {}, h('h4', {}, 'Les plus difficiles'), h('div', { class: 'mistake-list' }, hard.map((x) => h('span', { class: 'mistake' }, `${x.i.emoji || ''} ${x.i.answer || x.i.en}`, h('small', {}, ` ✗${x.s.ko}`)))))
          : null
      );
    });

    const history = st.history.slice(0, 10).map((s) => {
      const u = units.find((x) => x.id === s.unit);
      const d = new Date(s.t);
      return h(
        'div',
        { class: 'record-row' },
        h('span', {}, `${d.toLocaleDateString('fr-FR')} ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} · ${u?.emoji || '🔁'} ${MODES[s.mode]?.label || s.mode}`),
        h('b', {}, `${s.correct}/${s.asked}`)
      );
    });

    const fileInput = h('input', {
      type: 'file',
      accept: 'application/json,.json',
      class: 'hidden',
      onchange: async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          importData(await file.text());
          alert('Sauvegarde importée ✔');
          render();
        } catch {
          alert('Ce fichier n’est pas une sauvegarde valide.');
        }
      },
    });

    const voiceNote = !speechAvailable()
      ? '⚠️ Cet appareil ne propose pas de voix : l’application sera difficile à utiliser.'
      : hasVoice('en')
        ? `Voix anglaise : ${voiceName('en')}${hasVoice('fr') ? ` · voix française : ${voiceName('fr')}` : ''}`
        : '⚠️ Aucune voix anglaise trouvée : installez-en une dans les réglages de l’appareil (Synthèse vocale → langue anglaise).';

    body.replaceChildren(
      section(
        '👦 Enfant',
        h(
          'label',
          { class: 'switch-row' },
          h('span', {}, 'Prénom', h('small', {}, 'Utilisé dans « My name is… »')),
          h('input', { type: 'text', value: S.childName, maxlength: 20, class: 'text-input', onchange: (e) => update(() => (S.childName = e.target.value.trim() || 'Owen')) })
        ),
        selectRow('Âge', String(S.childAge), ['5', '6', '7', '8', '9', '10', '11', '12'], (v) => `${v} ans`, (v) => update(() => (S.childAge = Number(v))))
      ),
      ...unitSections,
      section(
        '⚙️ Réglages',
        selectRow('Questions par séance', String(S.questionsPerSession), ['5', '10', '15', '20'], (v) => v, (v) => update(() => (S.questionsPerSession = Number(v)))),
        switchRow('🗣️ Voix', S.voice, (v) => update(() => (S.voice = v)), voiceNote),
        selectRow('Accent', S.accent, ['GB', 'US'], (v) => ({ GB: '🇬🇧 Britannique', US: '🇺🇸 Américain' })[v], (v) => { update(() => (S.accent = v)); pickVoices(); render(); }),
        selectRow('Vitesse de la voix', String(S.voiceRate), ['0.7', '0.85', '1'], (v) => ({ 0.7: 'Lente', 0.85: 'Normale', 1: 'Rapide' })[v], (v) => update(() => (S.voiceRate = Number(v)))),
        h(
          'div',
          { class: 'row left wrap' },
          h('button', { class: 'btn small ghost', onclick: () => speak('Hello! I am Biscuit the dog. Let’s learn English together!'.replaceAll('’', "'"), { force: true }) }, '🔊 Tester la voix anglaise'),
          h('button', { class: 'btn small ghost', onclick: () => speak('Bonjour ! Je suis Biscuit le chien.', { force: true, lang: 'fr' }) }, '🔈 Tester la voix française')
        ),
        switchRow('🇫🇷 Traductions dans « J’apprends »', S.showFrench, (v) => update(() => (S.showFrench = v)), 'L’enfant peut toujours les afficher ou les cacher lui-même.'),
        switchRow('🔈 Bruitages', S.sound, (v) => update(() => (S.sound = v)))
      ),
      section(
        '🧭 Conseils',
        h('ul', { class: 'tips' },
          h('li', {}, 'À 7 ans, l’anglais s’apprend surtout à l’oral : écouter, répéter, associer à une image. Les exercices « Lis » et « Écris » sont des défis bonus.'),
          h('li', {}, 'Mieux vaut 10 minutes par jour qu’une heure le dimanche : les « Révisions du jour » sont faites pour ça.'),
          h('li', {}, 'Jouez ensemble à « Jacques a dit » en vrai, ou au café avec de vrais fruits !'),
          h('li', {}, 'Le jeu du perroquet utilise le micro (adresse https) : rien n’est enregistré ni envoyé.'))
      ),
      section(
        '📊 Progrès',
        h('div', { class: 'legend' }, ['Jamais vu', 'À revoir', 'En cours', 'Presque', 'Su', 'Très bien su'].map((t, i) => h('span', {}, h('i', { class: `heat b${i}` }), t))),
        ...progressSections,
        h('h3', {}, 'Dernières séances'),
        history.length ? history : h('p', { class: 'muted' }, 'Aucune séance pour le moment.')
      ),
      section(
        '💾 Données',
        h('p', { class: 'muted' }, 'Les progrès sont enregistrés sur cet appareil. Exportez-les pour les transférer sur un autre.'),
        h(
          'div',
          { class: 'row left wrap' },
          h(
            'button',
            {
              class: 'btn small',
              onclick: () => {
                const blob = new Blob([exportData()], { type: 'application/json' });
                const a = h('a', { href: URL.createObjectURL(blob), download: `anglais-owen-${new Date().toISOString().slice(0, 10)}.json` });
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 1000);
              },
            },
            '⬇️ Exporter'
          ),
          h('button', { class: 'btn small ghost', onclick: () => fileInput.click() }, '⬆️ Importer'),
          h(
            'button',
            {
              class: 'btn small danger',
              onclick: () => {
                if (confirm('Effacer tous les progrès, étoiles et records ? (Les réglages sont conservés.)')) {
                  resetProgress();
                  render();
                }
              },
            },
            '🗑️ Tout effacer'
          ),
          fileInput
        )
      )
    );
    save();
    window.scrollTo(0, y);
  }

  render();
  return el;
}
