/* 
Thanks to /dev/null#5726 for helping me convert this into a bot for the Dragon Injector Server

Version 1.2.2

1.2.2 - Minor changes and setting config stuff
1.2.1 - Added "testers" to excluded roles
1.2.0 - Changed Release yet again, added autodelete section.
1.1.8 - Changed release date
1.1.7 - fixed triggers
1.1.6 - Added Sale to keywords, changed release date and rephrased the replies.
1.1.5 - Added Beta Tester to excluded roles
1.1.4 - Added order/purchase stuff, fixed cost.
*/

/* Requirements */
const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;

/* Loggin the bot in and setting its activity */
client.on('ready',() => {
    console.log(`Logged in as ${client.user.tag}!`);
    //set the bot's activity
    client.user.setActivity("The Dragon's Horde", {type: "Watching"})

});

/* Checks trigger words, <#channelID> links to channel */
const triggers = [ { check: /^(?=.*\b(dragon ?injector|di)\b)(?=.*\b(preoder|pre-order)\b).*$/i, phrases: ['No preorders, sorry. Keep an eye on <#489199851171610649> Backorders are possible.', 'No preorders, sorry. Keep an eye on <#489199851171610649> Backorders are possible.', 'No preorders, sorry. Keep an eye on <#489199851171610649>. Backorders are possible.'] },
 { check: /^(?=.*\b(dragon ?injector|di)\b)(?=.*\b(order|buy|purchase|sale)\b).*$/i, phrases: ['The DragonInjector is currently not available to buy, release is later this month.(October)', 'The DragonInjector is currently not available to buy, expected release is later this month.(October)', 'The DragonInjector is currently not available to buy, expected release is later this month.(October)' ] },
    { check: /^(?=.*\b(dragon ?injector|di)\b)(?=.*\b(cost|price)\b).*$/i, phrases: ['Cost will be $28 USD plus postage and handling. See <#492513459385401346>.', 'Cost will be $28 USD plus postage and handling. See <#492513459385401346>.', 'Cost will be $28 USD plus postage and handling. See <#492513459385401346>.' ] }
]
let lastTriggered = {}; // Set up an empty object to track the last triggered time
const howLong = 1; // How many minutes between triggers

/* Set the bot to reply to messages*/
client.on('message', message => {
    //Bot won't reply to bots with this line
    if (message.author.bot) return;
   if (message.channel.type !== "text") { // Make sure we're in a text channel
        return;
    }
    //Doesn't return if have the following roles

if (! message.member || message.member.roles.find('name', 'Creator') || message.member.roles.find('name', 'The Fuzz') || message.member.roles.find('name', 'Beta Tester')|| message.member.roles.find('name', 'Testers')) {

        return;
    }
    
	//add autodelete message
	    if (message.channel.id == 628026385046437890 && 'I have read the conditions, agree with them, and I would like a tester unit!' !== message.content) {
        message.delete();
        return;
    }
    triggers.forEach(elem => {
        //Searches for the triggers in messages.     
        if (elem.check.test(message.content)) {
            const now = new Date(); // Set a constant with the date
            const lastTime = lastTriggered[elem.check] || 0;  // If there is an entry in lastTriggered for the check string, use that, otherwise set lastTime to 0
            if (now - lastTime > howLong * 60 * 1000) { // If it's been more than howLong minutes
                lastTriggered[elem.check] = now; // Set the last triggered time for this command's check string
                //Get random phrase for each trigger.
                var randtrig = Math.floor(Math.random()*triggers.length)
                //Replies with the random phrase
                message.reply(elem.phrases[randtrig])
            }
        }
    })
})

client.login(token);