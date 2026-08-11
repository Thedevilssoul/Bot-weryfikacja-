const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
// Render automatycznie przypisuje port w zmiennej środowiskowej, domyślnie 10000
const port = process.env.PORT || 10000;

app.use(cors());

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const GUILD_ID = "796356623718945281";

// KROK 1: Najważniejsze dla Rendera - natychmiastowe otwarcie portu i nasłuchiwanie zapytań
app.get('/', async (req, res) => {
    const username = req.query.username;
    
    if (!username) {
        return res.send("NOT_FOUND");
    }
    
    // Sprawdzamy czy bot zdążył się już połączyć z Discordem
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

// Uruchamiamy nasłuchiwanie na porcie 0.0.0.0, aby serwer Render bez problemu wykrył ruch sieciowy
app.listen(port, '0.0.0.0', () => {
    console.log(`Serwer HTTP nasłuchuje na porcie ${port}`);
    
    // KROK 2: Dopiero po udanym otwarciu portu logujemy bota do Discorda
    client.login(process.env.DISCORD_TOKEN).then(() => {
        console.log(`Bot pomyślnie zalogowany do Discorda!`);
    }).catch(err => {
        console.error("Błąd logowania bota:", err);
    });
});
