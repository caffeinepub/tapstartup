# TapStartup

## Current State
Пустой проект (нет src/). Создаём с нуля.

## Requested Changes (Diff)

### Add
- Dark neon landing page (TapStartup, "Something big is coming", countdown, email subscribe form)
- Backend: addSubscriber / getAllSubscribers
- `.well-known/ic-domains` с содержимым `www.kwtd.eu`
- `.ic-assets.json5` для включения dotfiles в asset canister
- Vite конфиг без SPA-redirect для dotfiles

### Modify
- N/A (новый проект)

### Remove
- N/A

## Implementation Plan
1. Создать файлы верификации домена в src/frontend/public/
2. Сгенерировать Motoko backend (email subscribers)
3. Создать frontend (dark neon, countdown, email form)
4. Задеплоить
