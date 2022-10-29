// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Message } = require('discord.js');
const { token, prefix, subRedditList, otherSubRedditList} = require('./config.json');
const { EmbedBuilder } = require('discord.js');

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
        
        case "#meme":
            const meme = await getMeme();
            

            const exampleEmbed = new EmbedBuilder()
                .setTitle(meme.data.title)
                .setDescription("subreddit: " + meme.data.subreddit_name_prefixed)
                .setImage(meme.data.url)

            message.channel.send({ embeds: [exampleEmbed] });

            break;
        case "#help":
            message.channel.send("literally just type !meme no other commands :wink: ")
            break;

           
        case "#post":
            const post = await getPost();

            const EmbedPost = new EmbedBuilder()
                .setTitle(post.data.title)
                .setDescription("subreddit: " + post.data.subreddit_name_prefixed)
                .setImage(post.data.url)
            if(message.channel.nsfw){
                message.channel.send({ embeds: [EmbedPost] });
            }
            
            break;
    }
});

const getPost = () => {
    return new Promise((resolve, reject) => {
        const url = otherSubRedditList[Math.floor(Math.random() * otherSubRedditList.length)];

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
