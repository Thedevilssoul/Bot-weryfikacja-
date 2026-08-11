const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors'); // Wymuszamy obsługę bezpiecznych połączeń
const app = express();
const port = process.env.PORT || 3000;

// Włączamy akceptowanie zapytań z każdej zewnętrznej strony (w tym z Bloggera)
app.use(cors());

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const GUILD_ID = "796356623718945281";

client.once('ready', () => {
    console.log(`Bot działa jako ${client.user.tag}!`);
});

app.get('/', async (req, res) => {
    const username = req.query.username;
    
    if (!username) {
        return res.status(400).send("NOT_FOUND");
    }
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const memberCollection = await guild.members.fetch({ limit: 1000 });
        
        const userFound = memberCollection.some(m => m.user.username.trim().toLowerCase() === username.trim().toLowerCase());
        const result = userFound ? "SUCCESS" : "NOT_FOUND";
        
        return res.send(result);
    } catch (error) {
        console.error("Błąd serwera:", error);
        return res.send("NOT_FOUND");
    }
});

app.listen(port, () => {
    console.log(`Serwer HTTP działa na porcie ${port}`);
});

client.login(process.env.DISCORD_TOKEN);
