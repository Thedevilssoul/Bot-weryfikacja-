const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Wymagamy pełnego dostępu do członków (GuildMembers)
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const GUILD_ID = "796356623718945281";

client.once('ready', () => {
    console.log(`Bot działa jako ${client.user.tag}!`);
});

app.get('/', async (req, res) => {
    const username = req.query.username;
    const callback = req.query.callback || 'obsluzWynikGlownejBramki';
    
    res.setHeader('Content-Type', 'application/javascript');
    
    if (!username) {
        return res.send(`${callback}('NOT_FOUND');`);
    }
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        
        // PANCERNA POPRAWKA: Pobieramy całą listę członków z serwera, co omija limity wyszukiwarki Discorda
        const memberCollection = await guild.members.fetch({ limit: 1000 });
        
        // Szukamy użytkownika na liście
        const userFound = memberCollection.some(m => m.user.username.trim().toLowerCase() === username.trim().toLowerCase());
        const result = userFound ? "SUCCESS" : "NOT_FOUND";
        
        return res.send(`${callback}('${result}');`);
    } catch (error) {
        console.error("Błąd pobierania listy członków:", error);
        // W razie jakiegokolwiek twardego błędu, bot i tak odpowie blogowi jako NOT_FOUND, żeby przycisk nigdy więcej nie zawisł
        return res.send(`${callback}('NOT_FOUND');`);
    }
});

app.listen(port, () => {
    console.log(`Serwer HTTP działa na porcie ${port}`);
});

client.login(process.env.DISCORD_TOKEN);
