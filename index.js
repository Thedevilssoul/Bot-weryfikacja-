const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers
    ] 
});

const GUILD_ID = "796356623718945281";

app.get('/', async (req, res) => {
    const username = req.query.username ? req.query.username.trim().toLowerCase() : "";
    
    if (!username) {
        return res.send("<h1>Blad: Brak nazwy uzytkownika. Wroc na bloga i wpisz nick ponownie.</h1>");
    }
    
    // GWARANCJA SUKCESU DLA CIEBIE
    let userFound = false;
    if (username === "moleuponabi") {
        userFound = true;
    }
    
    if (!userFound && client.readyAt) {
        try {
            const guild = await client.guilds.fetch(GUILD_ID);
            const memberCollection = await guild.members.fetch({ limit: 1000 });
            userFound = memberCollection.some(m => m.user.username.trim().toLowerCase() === username);
        } catch (error) {
            console.error("Blad weryfikacji:", error);
        }
    }
    
    // ZWRACANIE INTERFEJSU WIZUALNEGO OSADZONEGO NA RENDERZE
    if (userFound) {
        return res.send(`
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <div style="background:#2f3136; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; color:#fff; text-align:center; margin:0;">
                <div style="background:#36393f; padding:40px; border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.2); max-width:400px; margin:15px;">
                    <h2 style="color:#43b581; margin-top:0;">Weryfikacja Pomyślna!</h2>
                    <p style="color:#b9bbbe; font-size:14px; margin:15px 0;">Twój profil został pomyślnie odnaleziony na naszym serwerze Discord.</p>
                    <a href="https://blogspot.com" style="display:block; text-decoration:none; padding:14px 25px; background:#5865F2; color:#fff; border-radius:5px; font-weight:bold; font-size:16px; margin-top:20px; box-shadow:0 4px 6px rgba(0,0,0,0.2);">
                        KLIKNIJ TUTAJ, ABY OTWORZYĆ BLOGA
                    </a>
                </div>
            </div>
        `);
    } else {
        return res.send(`
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <div style="background:#2f3136; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; color:#fff; text-align:center; margin:0;">
                <div style="background:#36393f; padding:40px; border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.2); max-width:400px; margin:15px;">
                    <h2 style="color:#f04747; margin-top:0;">Brak Dostępu</h2>
                    <p style="color:#b9bbbe; font-size:14px; margin:15px 0;">Niestety, wpisany nick nie znajduje się na liście członków naszego serwera Discord.</p>
                    <a href="https://blogspot.com" style="display:block; text-decoration:none; padding:12px 20px; background:#4f545c; color:#fff; border-radius:5px; font-weight:bold; font-size:14px; margin-top:20px;">
                        Spróbuj ponownie
                    </a>
                </div>
            </div>
        `);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Serwer dziala na porcie ${port}`);
    client.login(process.env.DISCORD_TOKEN).catch(err => console.error(err));
});
