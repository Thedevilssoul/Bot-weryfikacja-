const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ] 
});

const GUILD_ID = "796356623718945281";

app.get('/', async (req, res) => {
    const username = req.query.username ? req.query.username.trim().toLowerCase() : "";
    // ODBIERANIE CALLBACKU: Kluczowe, by blog wiedział, co zrobić z wynikiem
    const callback = req.query.callback || 'obsluzWynikGlownejBramki';
    
    res.setHeader('Content-Type', 'application/javascript');
    
    if (!username) {
        return res.send(`${callback}('NOT_FOUND');`);
    }
    
    // GWARANCJA DOSTĘPU DLA CIEBIE: Twój nick przechodzi od razu w prawidłowym formacie JSONP
    if (username === "moleuponabi") {
        return res.send(`${callback}('SUCCESS');`);
    }
    
    if (!client.readyAt) {
        return res.send(`${callback}('NOT_FOUND');`);
    }
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const memberCollection = await guild.members.fetch({ limit: 1000 });
        
        const userFound = memberCollection.some(m => m.user.username.trim().toLowerCase() === username);
        const result = userFound ? "SUCCESS" : "NOT_FOUND";
        
        return res.send(`${callback}('${result}');`);
    } catch (error) {
        console.error("Błąd weryfikacji:", error);
        return res.send(`${callback}('NOT_FOUND');`);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Serwer HTTP nasłuchuje na porcie ${port}`);
    
    client.login(process.env.DISCORD_TOKEN).then(() => {
        console.log(`Bot pomyślnie zalogowany do Discorda!`);
    }).catch(err => {
        console.error("Błąd logowania bota:", err);
    });
});
