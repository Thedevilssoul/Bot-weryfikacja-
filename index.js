const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const GUILD_ID = "796356623718945281";

client.once('ready', () => {
    console.log(`Bot działa jako ${client.user.tag}!`);
});

app.get('/', async (req, res) => {
    const username = req.query.username;
    // POPRAWKA: Bot dynamicznie pobiera dokładnie taką funkcję, jakiej żąda Twój blog
    const callback = req.query.callback || 'obsluzWynikGlownejBramki';
    
    if (!username) {
        return res.send(`${callback}('NOT_FOUND');`);
    }
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const members = await guild.members.search({ query: username, limit: 10 });
        
        const userFound = members.some(m => m.user.username.toLowerCase() === username.toLowerCase());
        const result = userFound ? "SUCCESS" : "NOT_FOUND";
        
        res.setHeader('Content-Type', 'application/javascript');
        return res.send(`${callback}('${result}');`);
    } catch (error) {
        console.error("Błąd weryfikacji:", error);
        res.setHeader('Content-Type', 'application/javascript');
        return res.send(`${callback}('NOT_FOUND');`);
    }
});

app.listen(port, () => {
    console.log(`Serwer HTTP działa na porcie ${port}`);
});

client.login(process.env.DISCORD_TOKEN);
