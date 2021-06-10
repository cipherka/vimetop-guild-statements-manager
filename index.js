const config = require('./config.json');
const request = require('./request');
const moment = require('moment');

const bot = new (require('node-vk-bot-api'))(config.vk);
bot.on(async (ctx) => {
    const messageContent = ctx.message.text || ctx.message.body;
    const messageAuthorID = ctx.message.user_id || ctx.message.from_id;
    
    if(!messageContent.startsWith(config.bot.prefix)) return;
    const args = messageContent.slice(config.bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command == "бот")
        return ctx.reply(`Разработчик: Vlad_Cyphersky\nИсходный код: https://github.com/vlfz/vimetop-guild-statements-manager`);

    if(command == "загрузить" && config.bot.allowed.includes(messageAuthorID)) {
        let data = await request(config.vimetop.cookie, {
            type: 'load_statement',
            guild: config.vimetop.guild_id
        }).catch(console.error);
        if(data.data.status == false) return ctx.reply(`Сервер VimeTop отправил ошибку: ${data.data.msg}\nЕсли Вы не можете сами устранить данную ошибку, пожалуйста, обратитесь к разработчику бота: https://vk.com/id${config.bot.allowed[0]}`);

        let statementID = args.shift();
        if(statementID) {
            let statement = data.data.statements.find(statement => statement.id == statementID);
            if(!statement) return ctx.reply("Заявки с таким ID не существует, либо она уже была рассмотрена.");

            let msg = [
                `Заявка игрока https://vime.top/p/${statement.username}`,
                `Дата отправки: ${moment(Number(statement.time) * 1000).locale('ru').format('LLL')}\n`
            ];
            Object.keys(statement.form).forEach(
                key => msg.push(`${key} | ${statement.form[key]}`)
            );

            return ctx.reply(msg.join("\n"));
        } else {
            let msg = [
                `Количество заявок в гильдию на данный момент: ${data.data.statements.length}`,
                `Для просмотра заявки используйте команду:\n- ${config.bot.prefix}загрузить <ID заявки>`,
                `Для принятия/отклонения используйте команду\n- ${config.bot.prefix}заявка <ID заявки> +/-\n`
            ];

            for (let statement of data.data.statements)
                msg.push(`- ID заявки: ${statement.id} | ${statement.username} | ${moment(Number(statement.time) * 1000).locale('ru').fromNow()}`);

            return ctx.reply(msg.join("\n"));
        }
    }

    if(command == "заявка" && config.bot.allowed[0] == messageAuthorID) {
        let statementID = args.shift();
        if(!statementID) return ctx.reply("Вы не указали ID заявки.");
        
        let action = args.shift();
        if(!action || !['+', '-'].includes(action)) return ctx.reply("Вы не указали тип действия (+ | принять / - | отклонить).");

        let data = await request(config.vimetop.cookie, {
            type: 'check_statement',
            guild: config.vimetop.guild_id,
            action: (action == "+") ? 1 : 0,
            id: statementID
        }).catch(console.error);
        if(data.data.status == false) return ctx.reply(`Сервер VimeTop отправил ошибку: ${data.data.msg}\nЕсли Вы не можете сами устранить данную ошибку, пожалуйста, обратитесь к разработчику бота: https://vk.com/id${config.bot.allowed[0]}`);

        return ctx.reply(data.data.msg);
    }
});

bot.startPolling((err) => {
    if(err) return console.error(err);
    return console.log("* Polling started!");
});