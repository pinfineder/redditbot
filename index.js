// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Message } = require('discord.js');
const { token, prefix, subRedditList, otherSubRedditList, thirdSubRedditList } = require('./config.json');
const { EmbedBuilder } = require('discord.js');

const request = require('request');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix)) return

    switch (true) {

        case message.content.includes("meme"):
            const meme = await getPost(subRedditList);

            const memeEmbed = constructMeme(meme);
            message.channel.send({ embeds: [memeEmbed] });

            break;

        case message.content.includes("help"):
            message.channel.send("literally just type #meme no other commands :wink: ")
            break;

        case message.content.includes("post"):
            const params = {
                subredditList: otherSubRedditList,
                specific: false // possibly use this for custom message
            }

            if (message.author.id == 755101509229740114) {
                params.subredditList = thirdSubRedditList;
                params.specific = true;
            }

            getPost(otherSubRedditList)
                .then(post => {
                    if (!message.channel.nsfw) return;

                    const memeEmbed = constructMeme(post);
                    message.channel.send({ embeds: [memeEmbed] });

                })
                .catch(err => {
                    // top-tier error handling in Javascript
                    console.log(err);
                    message.channel.send('Someting went terribly wrong while trying to fetch posts from reddit D: ')
                })
            break;
    }
});

const getPost = (list) => {
    return new Promise((resolve, reject) => {
        const url = list[Math.floor(Math.random() * list.length)];

        request({
            uri: url,
            method: 'GET'
        }, (err, res) => {
            console.log(`Fetching from ${url}...`)
            if (err) return reject(err);
            if (res.statusCode != 200) return reject(err);

            const json = JSON.parse(res.body);
            const children = json.data.children;

            return resolve(children[Math.floor(Math.random() * children.length)]);
        });
    });
}

const constructMeme = (post) => new EmbedBuilder()
    .setTitle(post.data.title)
    .setDescription("subreddit: " + post.data.subreddit_name_prefixed)
    .setImage(post.data.url)


// Log in to Discord with the client's token
client.login(token);
