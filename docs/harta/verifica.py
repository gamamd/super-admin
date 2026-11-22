#!/usr/bin/env python3
"""Verifică harta (docs/harta/index.html) față de docs/. Ieșire 1 la orice nepotrivire.
Regula fixă (22.11.2026): orice editare în docs/ se reflectă în hartă, în același commit.
Folosire: python3 verifica.py [cale/docs]   (implicit: folderul părinte al acestui fișier)"""
import re, sys, glob, os
AICI = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.dirname(AICI)
HARTA = os.path.join(AICI, 'index.html') if len(sys.argv) <= 1 else os.path.join(DOCS, 'harta', 'index.html')
ASTEPT = {'✅': {'func', 'fin'}, '⚠️': {'live'}, '🔧': {'lucru'}, '⏸': {'idee'}, '💡': {'idee'}}
erori = []
h = open(HARTA, encoding='utf-8').read()

# --- harta: proiecte
rx = re.compile(r"^\s*\['([^']+)','[^']*','([^']+)','(idee|lucru|live|func|fin)','(net|rosie|rep|a2|ok|ret)','([rog a])','([^']*)'", re.M)
instr = rx.findall(h)
ids = [i[0] for i in instr]
for d in {x for x in ids if ids.count(x) > 1}: erori.append(f'id dublat în hartă: {d}')
n_declarate = len(re.findall(r"^\s*\['[A-Za-z0-9_]+','", h[h.index('const INSTR'):h.index('const EXT')], re.M))
if n_declarate != len(instr): erori.append(f'{n_declarate - len(instr)} proiecte din INSTR nu pot fi citite de verificator (format)')
activ = set(re.findall(r"^\s*\['([a-z0-9]+)','[A-Z]','", h[h.index('const ACTIV'):h.index('// id, nume')], re.M)) \
      | set(re.findall(r"\['([a-z0-9]+)','[A-Z]','[^']*'\]", h[h.index('const ACTIV'):h.index('// id, nume')]))
grupuri = set(re.findall(r"^\s*\['([A-Z])','", h[h.index('const GRUPURI'):h.index('const ACTIV')], re.M))
for i, a, st, ts, r, nr in instr:
    if a not in activ and a not in ids: erori.append(f'{i}: activitate/părinte inexistent „{a}”')
    if st == 'fin' and ts != 'ok': erori.append(f'{i}: ✅ finalizat fără teste trecute (chenar „{ts}”) — încalcă regula 11.11')
    if ts == 'ok' and st not in ('fin', 'func', 'live', 'lucru'): erori.append(f'{i}: teste trecute pe un proiect „{st}”')
ext = set(re.findall(r"\['(x[A-Z]+)','", h[h.index('const EXT'):h.index('const LEG')]))
for f, t in re.findall(r"\['([A-Za-z0-9_]+)','([A-Za-z0-9_]+)','[^']*','[rfdp]'\]", h[h.index('const LEG'):]):
    for x in (f, t):
        if x not in ids and x not in ext: erori.append(f'legătură spre un id inexistent: {x}')
for k in re.findall(r"^ ([a-z0-9_]+): \[$", h[h.index('const CUPRINS'):], re.M):
    if k not in ids: erori.append(f'cuprins pentru un id inexistent: {k}')

# --- docs: cap. 1–12 numerotate
doc = {}
for f in sorted(glob.glob(os.path.join(DOCS, 'proiecte', '[01][0-9]-*.md'))):
    if int(os.path.basename(f)[:2]) > 12: continue
    for ln in open(f, encoding='utf-8'):
        m = re.match(r'^- (\d+\.\d+(?:\.\d+)?)\s+(.*)', ln)
        if not m: continue
        e = re.search(r'(✅|⚠️|🔧|⏸|💡|❌)', m.group(2))
        if e and e.group(1) != '❌': doc[m.group(1)] = (e.group(1), os.path.basename(f))
harta_nr = {}
for i, a, st, ts, r, nr in instr:
    for t in nr.split(' · '):
        if re.fullmatch(r'\d+\.\d+(\.\d+)?', t.strip()): harta_nr.setdefault(t.strip(), []).append((i, st))
for n, (em, f) in sorted(doc.items()):
    if n not in harta_nr: erori.append(f'{f}: punctul {n} {em} nu e în hartă'); continue
    for i, st in harta_nr[n]:
        if st not in ASTEPT[em]: erori.append(f'{n}: docs {em} dar harta are „{st}” la „{i}”')
for n in harta_nr:
    if n not in doc: erori.append(f'harta are {n} (la „{harta_nr[n][0][0]}”) dar în docs nu există sau e ❌')

# --- cap. 13: pașii din „Ordinea lucrărilor”
c13 = os.path.join(DOCS, 'proiecte', '13-gama-md-site-nou.md')
if os.path.exists(c13):
    t = open(c13, encoding='utf-8').read()
    sec = t[t.index('## Ordinea lucrărilor'):] if '## Ordinea lucrărilor' in t else ''
    sec = sec.split('\n## ')[0] if sec else ''
    pasi = re.findall(r'^(\d+)\. ', sec, re.M)
    nrs = ' '.join(i[5] for i in instr)
    for p in pasi:
        if not re.search(rf'pas {p}\b', nrs): erori.append(f'cap. 13: pasul {p} din „Ordinea lucrărilor” nu apare în hartă')
    if not pasi: erori.append('cap. 13: nu găsesc „Ordinea lucrărilor”')
else: erori.append('lipsește cap. 13')

print(f'proiecte în hartă: {len(instr)} · puncte docs 1–12 verificate: {len(doc)}')
if erori:
    print(f'{len(erori)} NEPOTRIVIRI:'); [print(' -', e) for e in erori]; sys.exit(1)
print('OK — harta și docs sunt în acord')
