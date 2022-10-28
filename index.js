// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Message } = require('discord.js');
const { token, prefix, subRedditList} = require('./config.json');

const request = require('request');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (message)=>{
    if(!message.content.startsWith(prefix)) {
        return
    }
    switch(message.content){
        case "!meme":
            const meme = await getMeme();
            message.channel.send(meme.data.url)

            break;
    }
});

const getMeme = () => {
    return new Promise((resolve, reject) => {
        const url = subRedditList[Math.floor(Math.random() * subRedditList.length)];

        request({
            uri: url,
            method: 'GET'
        }, (err, res) => {
            console.log(`Fetching from ${url}...`)
            if(err) throw err;
            if(res.statusCode != 200) return console.error('418 - something went terribly wrong');
    
            const json = JSON.parse(res.body);
            const children = json.data.children;
    
            return resolve(children[Math.floor(Math.random() * children.length)]);
        });
    });
}

// https://www.reddit.com/r/memes/hot.json

// Log in to Discord with your client's token
client.login(token);
