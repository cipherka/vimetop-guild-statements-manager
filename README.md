# vimetop-guild-statements-manager
Бот-управляющий заявками в гильдию через внутреннее API VimeTop

## Как работает?
![gif-guide-1](https://cdn.discordapp.com/attachments/678992634387365908/852483250868846592/666121006211443.gif)

## Как запустить?
1. Переименуй `config.example.json` в `config.json` и отредактируй под себя

**Важно!** `config.vimetop.cookie` заполняется данными от VimeTop, не данными от личного кабинета VimeWorld.
![png-guide-2](https://i.imgur.com/If3ZTK8.png)

2. Установи нужные библиотеки командой `npm install` (если **yarn** - `yarn install`)
3. Запусти через `node index.js` (если **nodemon** - `nodemon index.js` | если **pm2** - `pm2 start index.js --name vt-bot`)

**Важно!** Бот тестировался на Node.js версии **12.6.0**. Версия ниже, вполне возможно, не поддерживается.
