# Генерирует SVG-заглушки для фото. Запуск: python3 gen_placeholders.py
import os, html

def svg(path, label, c1, c2, w=800, h=800, sub="Замените на своё фото"):
    s = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>
<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2.5" fill="#fff" fill-opacity=".35"/></pattern></defs>
<rect width="{w}" height="{h}" fill="url(#g)"/><rect width="{w}" height="{h}" fill="url(#p)"/>
<g transform="translate({w/2} {h/2-40})"><rect x="-70" y="-50" width="140" height="100" rx="14" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="6"/><circle cx="0" cy="0" r="26" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="6"/><circle cx="46" cy="-28" r="7" fill="#fff" fill-opacity=".9"/></g>
<text x="50%" y="{h/2+70}" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="{int(h*0.045)}" font-weight="600" fill="#fff">{html.escape(label)}</text>
<text x="50%" y="{h/2+110}" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="{int(h*0.028)}" fill="#fff" fill-opacity=".85">{html.escape(sub)}</text>
</svg>'''
    with open(path, 'w', encoding='utf-8') as f: f.write(s)

catalog = [
 ("marshmallow", "Букет из маршмеллоу", "#f2a0b5", "#f6c9a0"),
 ("string-art", "Стринг-арт", "#6cc3c9", "#2a8f98"),
 ("plastilin", "Аппликация из воздушного пластилина", "#b8d98d", "#6aa84f"),
 ("shopper", "Шоппер в русском стиле", "#e8805a", "#c0392b"),
 ("motanka", "Кукла Мотанка", "#e9c46a", "#d08a2e"),
 ("dymkovo", "Роспись дымковской игрушки", "#f4a261", "#e76f51"),
 ("birthday", "День рождения в Запечье", "#f9b4c8", "#e0558a"),
 ("suncatcher-rays", "Ловец солнца с лучами", "#ffd166", "#f4a300"),
 ("suncatcher-boho", "Ловец солнца в стиле бохо", "#d9b99b", "#a97c50"),
 ("suncatcher-fairy", "Ловец солнца сказочный", "#a3c4f3", "#6a7fdb"),
]
for name, label, c1, c2 in catalog:
    svg(f"images/catalog/{name}.svg", label, c1, c2)

svg("images/hero.svg", "Главное фото мастерской", "#2a9d8f", "#e9c46a", 1000, 800)
svg("images/about.svg", "Фото пространства", "#e76f51", "#f4a261", 1000, 800)
for i, (c1, c2) in enumerate([("#f4a261","#e76f51"),("#2a9d8f","#6cc3c9"),("#e9c46a","#f2a0b5"),("#a3c4f3","#6a7fdb"),("#b8d98d","#2a9d8f"),("#e8805a","#e9c46a")], 1):
    svg(f"images/gallery/{i}.svg", f"Работа {i}", c1, c2, 800, 800, "Фото работы ученика")
for i, (n, c1, c2) in enumerate([("Мастер 1","#e76f51","#e9c46a"),("Мастер 2","#2a9d8f","#a3c4f3"),("Мастер 3","#d08a2e","#f2a0b5")], 1):
    svg(f"images/team/{i}.svg", n, c1, c2, 800, 1000, "Фото мастера")
print("ok")
