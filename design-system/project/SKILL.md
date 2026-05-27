---
name: erut-design
description: Use this skill to generate well-branded interfaces and assets for ERUT (Ultrasonic Monitoring System) by 이로운소프트 — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and a Windows UI kit.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available
files (especially `colors_and_type.css`, the `preview/` cards, and the
`ui_kits/erut-windows/` kit).

ERUT is a **Windows desktop application** for **ultrasonic non-destructive
testing**. The visual language is **square (no border radius), cool navy +
light surface, with the brand blue `#2285EF` used ONLY for emphasis**. The
copy is **Korean-first**, technical, and terse (e.g. `검사 방식을 선택해
주세요.`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc),
copy assets out of `assets/` and create static HTML files that link
`colors_and_type.css`. If working on production code, you can copy assets
and read the rules in `README.md` to become an expert in designing with
this brand.

If the user invokes this skill without any other guidance, ask them what
they want to build or design, ask some questions, and act as an expert
designer who outputs HTML artifacts _or_ production code, depending on
the need.

## Quick rules — do, don't

- **Do** use square corners (`radius: 0`) on every surface. Pills (100px)
  and LED dots (50%) are the only exceptions.
- **Do** keep brand blue for emphasis only — selected card border, active
  toolbar icon, primary CTA. Never as a large fill.
- **Do** use **NanumSquare Bold** for almost everything. The `.acB / .acR`
  brand OTFs are wired up in `colors_and_type.css`.
- **Do** track text +0.020em (built into the tokens).
- **Don't** use emoji or unicode icon glyphs.
- **Don't** add drop shadows — surfaces are flat. The only "depth" is the
  inset glow inside status pills.
- **Don't** invent gradients beyond the established 10% brand wash used
  for active/selected card states.
