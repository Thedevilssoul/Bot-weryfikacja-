const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

// PEŁNA POPRAWKA INTENCJI: Włączamy wszystkie 4 kluczowe suwaki w kodzie bota
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
    const username = req.query.username;
    
    if (!username) {
        return res.send("NOT_FOUND");
    }
    
    if (!client.readyAt) {
        return res.send("NOT_FOUND");
    }
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const memberCollection = await guild.members.fetch({ limit: 1000 });
        
        const userFound = memberCollection.some(m => m.user.username.trim().toLowerCase() === username.trim().toLowerCase());
        const result = userFound ? "SUCCESS" : "NOT_FOUND";
        
        return res.send(result);
    } catch (error) {
        console.error("Błąd weryfikacji:", error);
        return res.send("NOT_FOUND");
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

