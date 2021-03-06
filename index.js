const discord = require('discord.js')
bot = new discord.Client()
colors = require('colors')
msconvert = require('milliseconds');
////////////////////[Configuration]\\\\\\\\\\\\\\\\\\\\
let conf = require("./config.json")
////////////////////[Other]\\\\\\\\\\\\\\\\\\\\

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
});

////////////////////[Functions]\\\\\\\\\\\\\\\\\\\\

function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return day + '/' + month + '/' + year;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sendEmbed(msg, type, guild, channel){
    if(type == "danger") {
        var Embed = new discord.RichEmbed()
            .setColor(16470357)
            .setDescription(msg)
    } else if(type == "warning") {
        var Embed = new discord.RichEmbed()
            .setColor(15924992)
            .setDescription(msg)
    } else if(type == "success") {
        var Embed = new discord.RichEmbed()
            .setColor(65336)
            .setDescription(msg)
    }
    bot.guilds.get(guild).channels.get(channel).send(Embed);
}

function checkMembers(users) {
    return new Promise(async resolve => {
        const theguilds = bot.guilds.get(conf.guildId);

        if(users === "all") {

            theguilds.members.forEach(member => {

                if (member.user.bot) return;

                const datecreated = member.user.createdAt;

                const date = getFormattedDate(datecreated).split("/");

                const newdate = new Date();

                if (date[2] !== newdate.getFullYear()) return;
                if (date[1] !== (1 + newdate.getMonth()).toString().padStart(2, '0')) return;
                if (date[1] === (1 + newdate.getMonth()).toString().padStart(2, '0')) {
                    if (date[0] === newdate.getDate().toString().padStart(2, '0')) {
                        member.user.send("Vous avez été banni car votre compte à été crée récemment");
                        sendEmbed(`${member.user} a été banni car son compte a été crée trop récemment`, "danger", conf.guildId, conf.channelLogsId)
                        setTimeout(function () {
                            theguilds.member(member).ban("Compte crée avant les normes réspectées du serveur.");
                        }, 1000);
                    }

                    var i = 0;
                    do {
                        i += 1;
                        if (date[0] === newdate.getDate().toString().padStart(2, '0') - i) {
                            member.user.send("Vous avez été banni car votre compte à été crée trop récemment");
                            sendEmbed(`${member.user} a été banni car son compte a été crée trop récemment`, "danger", conf.guildId, conf.channelLogsId)
                            setTimeout(function () {
                                theguilds.member(member).ban("Compte crée avant les normes réspectées du serveur.");
                            }, 1000);
                            break;
                        }
                    } while (i < conf.dayaccountminimum);

                }
            });

        } else {

            if (users.user.bot) return;

            const datecreated = users.user.createdAt;

            const date = getFormattedDate(datecreated).split("/");

            const newdate = new Date();

            if (date[2] !== newdate.getFullYear()) return;
            if (date[1] !== (1 + newdate.getMonth()).toString().padStart(2, '0')) return;
            if (date[1] === (1 + newdate.getMonth()).toString().padStart(2, '0')) {
                if (date[0] === newdate.getDate().toString().padStart(2, '0')) {
                    users.user.send("Vous avez été banni car votre compte à été crée récemment");
                    sendEmbed(`${users.user} a été banni car son compte a été crée trop récemment`, "danger", conf.guildId, conf.channelLogsId)
                    setTimeout(function () {
                        theguilds.member(users).ban("Compte crée avant les normes réspectées du serveur.");
                    }, 1000);
                }

                var i = 0;
                do {
                    i += 1;
                    if (date[0] === newdate.getDate().toString().padStart(2, '0') - i) {
                        users.user.send("Vous avez été banni car votre compte à été crée trop récemment");
                        sendEmbed(`${users.user} a été banni car son compte a été crée trop récemment`, "danger", conf.guildId, conf.channelLogsId)
                        setTimeout(function () {
                            theguilds.member(users).ban("Compte crée avant les normes réspectées du serveur.");
                        }, 1000);
                        break;
                    }
                } while (i < conf.dayaccountminimum);

            }
        }
    });
}

////////////////////[Bot on Ready]\\\\\\\\\\\\\\\\\\\\

bot.on('ready', () => {
    console.log(colors.info('-----------------------------------------------------'))
    console.log(colors.green(`--> Connecté avec succès en tant que: ${bot.user.tag}`))
    console.log(colors.info('-----------------------------------------------------'))
    var interval = setInterval(function () {
        checkMembers("all");
    }, msconvert.hours(1));
});

////////////////////[Bot on guildMemberAdd]\\\\\\\\\\\\\\\\\\\\

bot.on('guildMemberAdd', (member) => {

    if(member.user.bot) return;
    checkMembers(member);

})

////////////////////[Bot Login]\\\\\\\\\\\\\\\\\\\\ 

bot.login(conf.token);
