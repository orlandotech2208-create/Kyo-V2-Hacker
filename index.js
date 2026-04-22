// ╚»★『 ᏦᎽᎾ_𝐕𝟐_𝐇𝐀𝐂𝐊𝐄𝐑 』★«╝
// Créé par Orlando-tech — +50935443504
// Bot WhatsApp monolithique — Tout-en-un

import {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    downloadMediaMessage,
    getDevice
} from 'baileys';
import { Sticker } from 'wa-sticker-formatter';
import axios from 'axios';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';
import crypto from 'crypto';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

// ═══════════════════════════════════════════
// CONFIGURATION GLOBALE
// ═══════════════════════════════════════════

const OWNER_NUMBER = '50935443504';
const BOT_NAME = 'ᏦᎽᎾ_𝐕𝟐_𝐇𝐀𝐂𝐊𝐄𝐑';
const CREATOR = 'Orlando-tech';
const SESSION_DIR = 'sessionData';

// ═══════════════════════════════════════════
// FANCY FONT
// ═══════════════════════════════════════════

const monoFont = {
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲",
    f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷",
    k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼",
    p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁",
    u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘",
    F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝",
    K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢",
    P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧",
    U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
};

function stylizedChar(text) {
    if (typeof text !== 'string') return String(text);
    return [...text].map(c => monoFont[c] || c).join("");
}

// ═══════════════════════════════════════════
// CONFIG MANAGER
// ═══════════════════════════════════════════

const configPath = 'config.json';
const premiumPath = 'db.json';

let config = {};
let premiums = {};

function loadConfig() {
    if (fs.existsSync(configPath)) {
        try { config = JSON.parse(fs.readFileSync(configPath, 'utf-8')); }
        catch (e) { config = { users: {} }; }
    } else { config = { users: {} }; }
}

function saveConfig() {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function loadPremium() {
    if (fs.existsSync(premiumPath)) {
        try { premiums = JSON.parse(fs.readFileSync(premiumPath, 'utf-8')); }
        catch (e) { premiums = { premiumUser: {} }; }
    } else { premiums = { premiumUser: {} }; }
}

function savePremium() {
    fs.writeFileSync(premiumPath, JSON.stringify(premiums, null, 2));
}

loadConfig();
loadPremium();

// ═══════════════════════════════════════════
// ANTILINK STORAGE
// ═══════════════════════════════════════════

const antilinkSettings = {};
const warnStorage = {};

// ═══════════════════════════════════════════
// REACT UTILS
// ═══════════════════════════════════════════

async function react(client, message) {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const remoteJid = message?.key?.remoteJid;
    if (!remoteJid) return;
    try {
        await client.sendMessage(remoteJid, { react: { text: '🎯', key: message.key } });
        await sleep(1000);
        await client.sendMessage(remoteJid, { react: { text: '⚡', key: message.key } });
        await sleep(1000);
        await client.sendMessage(remoteJid, { react: { remove: true, key: message.key } });
    } catch (e) {}
}

// ═══════════════════════════════════════════
// BUG COMMAND
// ═══════════════════════════════════════════

async function bugCommand(message, client, texts, num) {
    try {
        const remoteJid = message.key?.remoteJid;
        await client.sendMessage(remoteJid, {
            image: { url: `database/${num}.jpg` },
            caption: `> ${texts}`,
            contextInfo: {
                externalAdReply: {
                    title: "Join Our WhatsApp Channel",
                    body: ` 𓆩 ${BOT_NAME} 𓆪 `,
                    mediaType: 1,
                    thumbnailUrl: `https://whatsapp.com/channel/0029VbBT7FdLCoX1TDyQQb1B`,
                    renderLargerThumbnail: false,
                    mediaUrl: `${num}.jpg`,
                    sourceUrl: `${num}.jpg`
                }
            }
        });
    } catch (e) { console.log(e); }
}

// ═══════════════════════════════════════════
// COMMANDS
// ═══════════════════════════════════════════

async function pingTest(client, message) {
    const remoteJid = message.key.remoteJid;
    const start = Date.now();
    await client.sendMessage(remoteJid, { text: "📡 Pinging..." }, { quoted: message });
    const latency = Date.now() - start;
    await client.sendMessage(remoteJid, {
        text: stylizedChar(`🚀 ${BOT_NAME} Network

Latency: ${latency} ms

${CREATOR}`)
    }, { quoted: message });
}

async function uptimeCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const text = `┌─🤖 ${BOT_NAME} ─┐
│
│ ⏱️ Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s
│ 💾 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)}MB
│
│ "Beyond limits, we rise."
│     - ${CREATOR} -
└────────────────────┘`;
    await client.sendMessage(remoteJid, { text: text });
}

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}

function getCategoryIcon(category) {
    const c = category.toLowerCase();
    if (c === "utils") return "⚙️";
    if (c === "media") return "📸";
    if (c === "group") return "👥";
    if (c === "bug") return "🐞";
    if (c === "tags") return "🏷️";
    if (c === "moderation") return "😶‍🌫️";
    if (c === "owner") return "✨";
    if (c === "creator") return "👑";
    if (c === "premium") return "💎";
    if (c === "settings") return "🔧";
    return "🎯";
}

const commandCategories = {
    "utils": ["ping", "uptime", "menu", "fancy", "setpp", "getpp"],
    "media": ["photo", "toaudio", "sticker", "play", "img", "vv", "save", "tiktok", "url"],
    "group": ["tag", "tagall", "tagadmin", "kick", "kickall", "kickall2", "promote", "demote", "promoteall", "demoteall", "mute", "unmute", "gclink", "antilink", "bye", "join"],
    "moderation": ["block", "unblock"],
    "bug": ["close", "fuck"],
    "owner": ["sudo", "delsudo"],
    "premium": ["addprem", "delprem", "auto-promote", "auto-demote", "auto-left"],
    "settings": ["public", "setprefix", "autotype", "autorecord", "welcome"],
    "creator": ["test"]
};

async function menuCmd(client, message) {
    try {
        const remoteJid = message.key.remoteJid;
        const userName = message.pushName || "Unknown";
        const usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(1);
        const uptime = formatUptime(process.uptime());
        const platform = os.platform();
        const botId = client.user.id.split(":")[0];
        const prefix = config.users?.[botId]?.prefix || ".";
        const now = new Date();
        const daysFR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        const day = daysFR[now.getDay()];

        let menuText = `
${BOT_NAME} 🎯
👤 Créé par ${CREATOR}
📱 +${OWNER_NUMBER}
────────────
• Prefix   : ${prefix}
• User     : ${stylizedChar(userName)}
• Version  : 2.0.0
• Uptime   : ${uptime}
• RAM      : ${usedRam}/${totalRam} MB
• Platform : ${platform}
• Date     : ${date} - ${stylizedChar(day)}
────────────
`;

        for (const [category, commands] of Object.entries(commandCategories)) {
            const icon = getCategoryIcon(category);
            const catName = stylizedChar(category);
            menuText += `┏━━━ ${icon} ${catName} ━━━
`;
            commands.forEach(cmd => { menuText += `┃   › ${stylizedChar(cmd)}
`; });
            menuText += `┗━━━━━━━━━━━━━━━
`;
        }
        menuText = menuText.trim();

        try {
            const device = getDevice(message.key.id);
            if (device === "android") {
                await client.sendMessage(remoteJid, {
                    text: stylizedChar(menuText),
                    contextInfo: {
                        participant: "0@s.whatsapp.net",
                        remoteJid: "status@broadcast",
                        quotedMessage: { conversation: ` ${BOT_NAME}` },
                        isForwarded: true
                    }
                });
            } else {
                await client.sendMessage(remoteJid, { text: stylizedChar(menuText) }, { quoted: message });
            }
        } catch (err) {
            await client.sendMessage(remoteJid, { text: "❌ Erreur menu: " + err.message }, { quoted: message });
        }
    } catch (err) { console.log("Menu error:", err); }
}

async function uploadToCatbox(buffer, fileName) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, fileName);
    const res = await axios.post('https://catbox.moe/user/api.php', form, { headers: form.getHeaders() });
    return res.data.trim();
}

async function urlCmd(client, message) {
    const jid = message.key.remoteJid;
    const ctx = message.message?.extendedTextMessage?.contextInfo;
    if (!ctx?.quotedMessage) return client.sendMessage(jid, { text: 'Reply to media.' });
    let mediaMessage = null, ext = 'bin';
    if (ctx.quotedMessage.imageMessage) { mediaMessage = { imageMessage: ctx.quotedMessage.imageMessage }; ext = 'jpg'; }
    else if (ctx.quotedMessage.videoMessage) { mediaMessage = { videoMessage: ctx.quotedMessage.videoMessage }; ext = 'mp4'; }
    else if (ctx.quotedMessage.audioMessage) { mediaMessage = { audioMessage: ctx.quotedMessage.audioMessage }; ext = 'mp3'; }
    else if (ctx.quotedMessage.documentMessage) { mediaMessage = { documentMessage: ctx.quotedMessage.documentMessage }; ext = ctx.quotedMessage.documentMessage.fileName?.split('.').pop() || 'bin'; }
    else return client.sendMessage(jid, { text: 'Unsupported.' });
    await client.sendMessage(jid, { text: 'Uploading…' });
    const buffer = await downloadMediaMessage({ key: { remoteJid: jid, id: ctx.stanzaId, fromMe: false }, message: mediaMessage }, 'buffer');
    const type = await fileTypeFromBuffer(buffer);
    if (type?.ext) ext = type.ext;
    const fileName = `file_${Date.now()}.${ext}`;
    const link = await uploadToCatbox(buffer, fileName);
    await client.sendMessage(jid, { text: link });
}

async function imgCmd(message, client) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
    const args = text.trim().split(/\s+/).slice(1);
    const query = args.join(" ");
    if (!query) return await client.sendMessage(remoteJid, { text: "🖼️ Fournis des mots-clés\nEx: .img hacker" });
    try {
        await client.sendMessage(remoteJid, { text: `🔍 Recherche: "${query}"...` });
        const apiUrl = `https://christus-api.vercel.app/image/Pinterest?query=${encodeURIComponent(query)}&limit=10`;
        const response = await axios.get(apiUrl, { timeout: 15000 });
        if (!response.data?.status || !Array.isArray(response.data.results) || response.data.results.length === 0)
            return await client.sendMessage(remoteJid, { text: "❌ Aucune image." });
        const images = response.data.results.filter(item => item.imageUrl && /\.(jpg|jpeg|png|webp)$/i.test(item.imageUrl)).slice(0, 5);
        if (images.length === 0) return await client.sendMessage(remoteJid, { text: "❌ Aucune image valide." });
        for (const image of images) {
            try {
                await client.sendMessage(remoteJid, { image: { url: image.imageUrl }, caption: `📷 ${query}\n${image.title && image.title !== "No title" ? image.title + "\n" : ""}© ${CREATOR}` });
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) { continue; }
        }
    } catch (error) {
        console.error("IMG ERROR:", error.message);
        await client.sendMessage(remoteJid, { text: "❌ Erreur API." });
    }
}

async function tagall(client, message) {
    const remoteJid = message.key.remoteJid;
    if (!remoteJid.includes('@g.us')) return;
    try {
        const groupMetadata = await client.groupMetadata(remoteJid);
        const participants = groupMetadata.participants.map(user => user.id);
        const text = participants.map(user => `@${user.split('@')[0]}`).join(' \n');
        await client.sendMessage(remoteJid, {
            text: `╭─⌈ 🚀 ${BOT_NAME} Broadcast ⌋\n│\n${text}\n│\n╰─⌊ Powered by ${CREATOR} ⌉`,
            mentions: participants
        });
    } catch (error) { console.error("Tagall error:", error); }
}

async function tagadmin(client, message) {
    const remoteJid = message.key.remoteJid;
    const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';
    if (!remoteJid.includes('@g.us')) return;
    try {
        const { participants } = await client.groupMetadata(remoteJid);
        const admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id);
        if (admins.length === 0) return;
        const text = `╭─⌈ 🛡️ ${BOT_NAME} Alert ⌋\n│ Admin Alert\n│\n${admins.map(user => `@${user.split('@')[0]}`).join('\n')}\n│\n╰─⌊ ${CREATOR} Control ⌉`;
        await client.sendMessage(remoteJid, { text, mentions: admins });
    } catch (error) { console.error("Tagadmin error:", error); }
}

async function tagRespond(client, message) {
    const number = client.user.id.split(':')[0];
    const remoteJid = message.key.remoteJid;
    const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
    if (!config.users[number]) return;
    const tagRespond = config.users[number].response;
    if ((!message.key.fromMe) && tagRespond) {
        const lid = client.user?.lid?.split(':')[0];
        if (lid && messageBody.includes(`@${lid}`)) {
            await client.sendMessage(remoteJid, {
                audio: { url: "database/DigiX.mp3" },
                mimetype: "audio/mp4",
                ptt: true,
                contextInfo: { stanzaId: message.key.id, participant: message.key.participant || lid, quotedMessage: message.message }
            });
        }
    }
}

async function tagCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    if (!remoteJid.includes('@g.us')) return;
    try {
        const groupMetadata = await client.groupMetadata(remoteJid);
        const participants = groupMetadata.participants.map(user => user.id);
        const messageBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const commandAndArgs = messageBody.slice(1).trim();
        const parts = commandAndArgs.split(/\s+/);
        const text = parts.slice(1).join(' ') || `${BOT_NAME} Alert`;
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quotedMessage) {
            if (quotedMessage.stickerMessage) {
                await client.sendMessage(remoteJid, { sticker: quotedMessage.stickerMessage, mentions: participants });
                return;
            }
            const quotedText = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || "";
            await client.sendMessage(remoteJid, { text: `${quotedText}`, mentions: participants });
            return;
        }
        await client.sendMessage(remoteJid, { text: `${text}`, mentions: participants });
    } catch (error) { console.error("Tag error:", error); }
}

function DigixNew(message) {
    if (!message) return null;
    return message.viewOnceMessageV2?.message || message;
}

function modifyViewOnce(obj) {
    if (typeof obj !== 'object' || obj === null) return;
    for (const key in obj) {
        if (key === 'viewOnce' && typeof obj[key] === 'boolean') obj[key] = false;
        else if (typeof obj[key] === 'object') modifyViewOnce(obj[key]);
    }
}

async function viewonceCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMessage?.imageMessage?.viewOnce && !quotedMessage?.videoMessage?.viewOnce && !quotedMessage?.audioMessage?.viewOnce) {
        await client.sendMessage(remoteJid, { text: stylizedChar('_Reply to a valid ViewOnce message._') });
        return;
    }
    const content = DigixNew(quotedMessage);
    modifyViewOnce(content);
    try {
        if (content?.imageMessage) {
            const mediaBuffer = await downloadMediaMessage({ message: content }, 'buffer', {});
            if (!mediaBuffer) throw new Error('Failed');
            const tempFilePath = path.resolve('./temp_view_once_image.jpeg');
            fs.writeFileSync(tempFilePath, mediaBuffer);
            await client.sendMessage(remoteJid, { image: { url: tempFilePath } });
            fs.unlinkSync(tempFilePath);
        } else if (content?.videoMessage) {
            const mediaBuffer = await downloadMediaMessage({ message: content }, 'buffer', {});
            if (!mediaBuffer) throw new Error('Failed');
            const tempFilePath = path.resolve('./temp_view_once_image.mp4');
            fs.writeFileSync(tempFilePath, mediaBuffer);
            await client.sendMessage(remoteJid, { video: { url: tempFilePath } });
            fs.unlinkSync(tempFilePath);
        } else if (content?.audioMessage) {
            const mediaBuffer = await downloadMediaMessage({ message: content }, 'buffer', {});
            if (!mediaBuffer) throw new Error('Failed');
            const tempFilePath = path.resolve('./temp_view_once_image.mp3');
            fs.writeFileSync(tempFilePath, mediaBuffer);
            await client.sendMessage(remoteJid, { audio: { url: tempFilePath } });
            fs.unlinkSync(tempFilePath);
        } else {
            await client.sendMessage(remoteJid, { text: stylizedChar('_No valid media._') });
        }
    } catch (error) {
        console.error('ViewOnce error:', error);
        await client.sendMessage(remoteJid, { text: stylizedChar('_Error processing ViewOnce._') });
    }
}

async function saveCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const bot = client.user.id.split(':')[0] + "@s.whatsapp.net";
    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMessage?.imageMessage?.viewOnce && !quotedMessage?.videoMessage?.viewOnce && !quotedMessage?.audioMessage?.viewOnce) {
        await client.sendMessage(remoteJid, { text: '_Reply to a valid ViewOnce message._' });
        return;
    }
    const content = DigixNew(quotedMessage);
    modifyViewOnce(content);
    try {
        if (content?.imageMessage) {
            const mediaBuffer = await downloadMediaMessage({ message: content }, 'buffer', {});
            if (!mediaBuffer) throw new Error('Failed');
            const tempFilePath = path.resolve('./temp_view_once_image.jpeg');
            fs.writeFileSync(tempFilePath, mediaBuffer);
            await client.sendMessage(bot, { image: { url: tempFilePath } });
            fs.unlinkSync(tempFilePath);
        } else if (content?.videoMessage) {
            const mediaBuffer = await downloadMediaMessage({ message: content }, 'buffer', {});
            if (!mediaBuffer) throw new Error('Failed');
            const tempFilePath = path.resolve('./temp_view_once_image.mp4');
            fs.writeFileSync(tempFilePath, mediaBuffer);
            await client.sendMessage(bot, { video: { url: tempFilePath } });
            fs.unlinkSync(tempFilePath);
        } else if (content?.audioMessage) {
            const mediaBuffer = await downloadMediaMessage({ message: content }, 'buffer', {});
            if (!mediaBuffer) throw new Error('Failed');
            const tempFilePath = path.resolve('./temp_view_once_image.mp3');
            fs.writeFileSync(tempFilePath, mediaBuffer);
            await client.sendMessage(bot, { audio: { url: tempFilePath } });
            fs.unlinkSync(tempFilePath);
        } else {
            await client.sendMessage(remoteJid, { text: '_No valid media._' });
        }
    } catch (error) {
        console.error('Save error:', error);
        await client.sendMessage(remoteJid, { text: '_Error._' });
    }
}

async function setpp(client, message) {
    try {
        const remoteJid = message.key.remoteJid;
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted && !message.message?.imageMessage) return await client.sendMessage(remoteJid, { text: '📸 Réponds à une image.' });
        const media = quoted ? quoted : message;
        const imageBuffer = await client.downloadMediaMessage(media);
        if (!imageBuffer) return await client.sendMessage(remoteJid, { text: '❌ Impossible.' });
        const tempPath = path.join(os.tmpdir(), `pp_${Date.now()}.jpg`);
        fs.writeFileSync(tempPath, imageBuffer);
        await client.updateProfilePicture(client.user.id, { url: tempPath });
        fs.unlinkSync(tempPath);
        await client.sendMessage(remoteJid, { text: '✅ Photo changée 🚀' });
    } catch (err) {
        console.error('SETPP ERROR:', err.message);
        await client.sendMessage(message.key.remoteJid, { text: '❌ Erreur' });
    }
}

async function getpp(client, message) {
    try {
        const remoteJid = message.key.remoteJid;
        const args = message.message?.conversation?.split(' ') || [];
        let targetJid;
        if (args[1] && args[1].includes('@')) targetJid = args[1];
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) targetJid = message.message.extendedTextMessage.contextInfo.participant;
        else if (remoteJid.includes('@g.us')) targetJid = remoteJid;
        else targetJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
        const profilePic = await client.profilePictureUrl(targetJid, 'image');
        if (profilePic) await client.sendMessage(remoteJid, { image: { url: profilePic }, caption: '📸 Photo ✅' });
        else await client.sendMessage(remoteJid, { text: '❌ Aucune photo.' });
    } catch (err) {
        console.error('GETPP ERROR:', err.message);
        await client.sendMessage(message.key.remoteJid, { text: '❌ Impossible.' });
    }
}

async function antilink(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        const metadata = await client.groupMetadata(groupId);
        const senderId = message.key.participant || groupId;
        const sender = metadata.participants.find(p => p.id === senderId);
        if (!sender?.admin) return await client.sendMessage(groupId, { text: '🔒 *Admins uniquement !*' });
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const args = text.split(/\s+/).slice(1);
        const action = args[0]?.toLowerCase();
        if (!action) {
            const usage = `🔒 *${BOT_NAME} - Antilink*\n\n.antilink on\n.antilink off\n.antilink set delete | kick | warn\n.antilink status`;
            return await client.sendMessage(groupId, { text: usage });
        }
        switch (action) {
            case 'on':
                antilinkSettings[groupId] = { enabled: true, action: 'delete' };
                await client.sendMessage(groupId, { text: '✅ *Antilink activé*' });
                break;
            case 'off':
                delete antilinkSettings[groupId];
                await client.sendMessage(groupId, { text: '❌ *Antilink désactivé*' });
                break;
            case 'set':
                if (args.length < 2) return await client.sendMessage(groupId, { text: '❌ Usage: .antilink set delete | kick | warn' });
                const setAction = args[1].toLowerCase();
                if (!['delete', 'kick', 'warn'].includes(setAction)) return await client.sendMessage(groupId, { text: '❌ Actions: delete, kick, warn' });
                if (!antilinkSettings[groupId]) antilinkSettings[groupId] = { enabled: true, action: setAction };
                else antilinkSettings[groupId].action = setAction;
                await client.sendMessage(groupId, { text: `✅ *Action:* ${setAction}` });
                break;
            case 'status':
                const status = antilinkSettings[groupId];
                await client.sendMessage(groupId, { text: `📊 *Statut*\n\nActivé: ${status?.enabled ? '✅' : '❌'}\nAction: ${status?.action || 'Aucune'}` });
                break;
            default:
                await client.sendMessage(groupId, { text: '❌ Usage: .antilink on/off/set/status' });
        }
    } catch (error) { console.error('Antilink error:', error); }
}

async function linkDetection(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    const setting = antilinkSettings[groupId];
    if (!setting?.enabled) return;
    const senderId = message.key.participant || groupId;
    const messageText = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const linkPatterns = [
        /https?:\/\//i, /www\./i, /\.com\b/i, /\.net\b/i, /\.org\b/i,
        /tiktok\.com/i, /instagram\.com/i, /facebook\.com/i, /whatsapp\.com/i,
        /chat\.whatsapp\.com/i, /t\.me/i, /telegram/i, /discord/i, /youtube\.com/i, /youtu\.be/i
    ];
    const hasLink = linkPatterns.some(pattern => pattern.test(messageText));
    if (!hasLink) return;
    try {
        const metadata = await client.groupMetadata(groupId);
        const sender = metadata.participants.find(p => p.id === senderId);
        const bot = metadata.participants.find(p => p.id.includes(client.user.id.split(':')[0]));
        if (sender?.admin) return;
        if (!bot?.admin) return;
        if (setting.action === 'delete' || setting.action === 'kick' || setting.action === 'warn') {
            try { await client.sendMessage(groupId, { delete: message.key }); } catch (e) {}
        }
        const platforms = [];
        if (/tiktok\.com/i.test(messageText)) platforms.push('TikTok');
        if (/instagram\.com/i.test(messageText)) platforms.push('Instagram');
        if (/facebook\.com/i.test(messageText)) platforms.push('Facebook');
        if (/whatsapp\.com/i.test(messageText)) platforms.push('WhatsApp');
        if (/t\.me|telegram/i.test(messageText)) platforms.push('Telegram');
        if (/discord/i.test(messageText)) platforms.push('Discord');
        if (/youtube\.com|youtu\.be/i.test(messageText)) platforms.push('YouTube');
        if (platforms.length === 0) platforms.push('Site Web');
        if (setting.action === 'warn') {
            const warnKey = `${groupId}_${senderId}`;
            warnStorage[warnKey] = (warnStorage[warnKey] || 0) + 1;
            const warns = warnStorage[warnKey];
            await client.sendMessage(groupId, { text: `🚫 *Lien ${platforms.join('/')}*\nWarn ${warns}/3\n@${senderId.split('@')[0]}`, mentions: [senderId] });
            if (warns >= 3) {
                await client.groupParticipantsUpdate(groupId, [senderId], 'remove');
                await client.sendMessage(groupId, { text: `⚡ *Expulsé*\n@${senderId.split('@')[0]}\n3 warns atteints` });
                delete warnStorage[warnKey];
            }
        } else if (setting.action === 'kick') {
            await client.groupParticipantsUpdate(groupId, [senderId], 'remove');
            await client.sendMessage(groupId, { text: `⚡ *Expulsé*\n@${senderId.split('@')[0]}\nRaison: Lien ${platforms.join('/')}`, mentions: [senderId] });
        } else if (setting.action === 'delete') {
            await client.sendMessage(groupId, { text: `🚫 *Lien supprimé*\n@${senderId.split('@')[0]} - ${platforms.join('/')}`, mentions: [senderId] });
        }
    } catch (error) { console.error('LinkDetection error:', error.message); }
}

async function kick(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        const text = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const args = text.split(/\s+/).slice(1);
        let target;
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) target = message.message.extendedTextMessage.contextInfo.participant;
        else if (args[0]) target = args[0].replace('@', '') + '@s.whatsapp.net';
        else return await client.sendMessage(groupId, { text: '❌ Réponds ou mentionne.' });
        await client.groupParticipantsUpdate(groupId, [target], 'remove');
        await client.sendMessage(groupId, { text: `🚫 @${target.split('@')[0]} exclu.` });
    } catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function kickall(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        const metadata = await client.groupMetadata(groupId);
        const targets = metadata.participants.filter(p => !p.admin).map(p => p.id);
        await client.sendMessage(groupId, { text: `⚡ ${BOT_NAME} - Purge...` });
        for (const target of targets) { try { await client.groupParticipantsUpdate(groupId, [target], 'remove'); } catch {} }
        await client.sendMessage(groupId, { text: '✅ Purge terminée.' });
    } catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function kickall2(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        const metadata = await client.groupMetadata(groupId);
        const targets = metadata.participants.filter(p => !p.admin).map(p => p.id);
        await client.sendMessage(groupId, { text: `⚡ ${BOT_NAME} - One Shot...` });
        await client.groupParticipantsUpdate(groupId, targets, 'remove');
        await client.sendMessage(groupId, { text: '✅ Tous exclus.' });
    } catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function promote(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        const text = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const args = text.split(/\s+/).slice(1);
        let target;
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) target = message.message.extendedTextMessage.contextInfo.participant;
        else if (args[0]) target = args[0].replace('@', '') + '@s.whatsapp.net';
        else return await client.sendMessage(groupId, { text: '❌ Réponds ou mentionne.' });
        await client.groupParticipantsUpdate(groupId, [target], 'promote');
        await client.sendMessage(groupId, { text: `👑 @${target.split('@')[0]} promu.` });
    } catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function demote(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        const text = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const args = text.split(/\s+/).slice(1);
        let target;
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) target = message.message.extendedTextMessage.contextInfo.participant;
        else if (args[0]) target = args[0].replace('@', '') + '@s.whatsapp.net';
        else return await client.sendMessage(groupId, { text: '❌ Réponds ou mentionne.' });
        await client.groupParticipantsUpdate(groupId, [target], 'demote');
        await client.sendMessage(groupId, { text: `📉 @${target.split('@')[0]} rétrogradé.` });
    } catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function gclink(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        const code = await client.groupInviteCode(groupId);
        await client.sendMessage(groupId, { text: `🔗 Lien:\nhttps://chat.whatsapp.com/${code}` });
    } catch { await client.sendMessage(groupId, { text: '❌ Impossible.' }); }
}

async function joinCmd(client, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const match = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i);
        if (match) {
            await client.groupAcceptInvite(match[1]);
            await client.sendMessage(message.key.remoteJid, { text: '✅ Rejoint!' });
        } else await client.sendMessage(message.key.remoteJid, { text: '❌ Lien invalide.' });
    } catch { await client.sendMessage(message.key.remoteJid, { text: '❌ Erreur.' }); }
}

async function pall(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        const metadata = await client.groupMetadata(groupId);
        const nonAdmins = metadata.participants.filter(p => !p.admin).map(p => p.id);
        for (const target of nonAdmins) { try { await client.groupParticipantsUpdate(groupId, [target], 'promote'); } catch {} }
        await client.sendMessage(groupId, { text: `✅ Tous promus.` });
    } catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function dall(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        const metadata = await client.groupMetadata(groupId);
        const admins = metadata.participants.filter(p => p.admin && !p.id.includes(client.user.id.split(':')[0])).map(p => p.id);
        for (const target of admins) { try { await client.groupParticipantsUpdate(groupId, [target], 'demote'); } catch {} }
        await client.sendMessage(groupId, { text: `✅ Tous rétrogradés.` });
    } catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function mute(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try { await client.groupSettingUpdate(groupId, 'announcement'); await client.sendMessage(groupId, { text: '🔇 Groupe fermé.' }); }
    catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function unmute(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try { await client.groupSettingUpdate(groupId, 'not_announcement'); await client.sendMessage(groupId, { text: '🔊 Groupe ouvert.' }); }
    catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function bye(client, message) {
    const groupId = message.key.remoteJid;
    if (!groupId.includes('@g.us')) return;
    try {
        await client.sendMessage(groupId, { text: `👋 ${BOT_NAME} quitte le groupe.` });
        await client.groupLeave(groupId);
    } catch { await client.sendMessage(groupId, { text: '❌ Erreur' }); }
}

async function autoPromote(client, message) {
    await client.sendMessage(message.key.remoteJid, { text: '✅ Auto-promote configuré.' });
}

async function autoDemote(client, message) {
    await client.sendMessage(message.key.remoteJid, { text: '✅ Auto-demote configuré.' });
}

async function autoLeft(client, message) {
    await client.sendMessage(message.key.remoteJid, { text: '✅ Auto-left configuré.' });
}

async function blockCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.split(/\s+/).slice(1);
    let target;
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) target = message.message.extendedTextMessage.contextInfo.participant;
    else if (args[0]) target = args[0].replace('@', '') + '@s.whatsapp.net';
    else return await client.sendMessage(remoteJid, { text: '❌ Mentionne ou réponds.' });
    try { await client.updateBlockStatus(target, 'block'); await client.sendMessage(remoteJid, { text: `🚫 @${target.split('@')[0]} bloqué.`, mentions: [target] }); }
    catch { await client.sendMessage(remoteJid, { text: '❌ Erreur.' }); }
}

async function unblockCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.split(/\s+/).slice(1);
    let target;
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) target = message.message.extendedTextMessage.contextInfo.participant;
    else if (args[0]) target = args[0].replace('@', '') + '@s.whatsapp.net';
    else return await client.sendMessage(remoteJid, { text: '❌ Mentionne ou réponds.' });
    try { await client.updateBlockStatus(target, 'unblock'); await client.sendMessage(remoteJid, { text: `✅ @${target.split('@')[0]} débloqué.`, mentions: [target] }); }
    catch { await client.sendMessage(remoteJid, { text: '❌ Erreur.' }); }
}

async function sudoCmd(client, message, approvedUsers) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.split(/\s+/).slice(1);
    if (!args[0]) return await client.sendMessage(remoteJid, { text: '❌ Usage: .sudo @user' });
    const target = args[0].replace('@', '') + '@s.whatsapp.net';
    if (approvedUsers.includes(target)) return await client.sendMessage(remoteJid, { text: 'ℹ️ Déjà sudo.' });
    approvedUsers.push(target);
    await client.sendMessage(remoteJid, { text: `✅ @${target.split('@')[0]} ajouté.`, mentions: [target] });
}

async function delsudoCmd(client, message, approvedUsers) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.split(/\s+/).slice(1);
    if (!args[0]) return await client.sendMessage(remoteJid, { text: '❌ Usage: .delsudo @user' });
    const target = args[0].replace('@', '') + '@s.whatsapp.net';
    const index = approvedUsers.indexOf(target);
    if (index === -1) return await client.sendMessage(remoteJid, { text: '❌ Non trouvé.' });
    approvedUsers.splice(index, 1);
    await client.sendMessage(remoteJid, { text: `✅ @${target.split('@')[0]} retiré.`, mentions: [target] });
}

async function isPublic(message, client) {
    const remoteJid = message.key.remoteJid;
    const number = client.user.id.split(':')[0];
    const current = config.users[number]?.publicMode || false;
    if (!config.users[number]) config.users[number] = {};
    config.users[number].publicMode = !current;
    saveConfig();
    await client.sendMessage(remoteJid, { text: `👥 Mode public: ${!current ? '✅' : '❌'}` });
}

async function setprefix(message, client) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.split(/\s+/).slice(1);
    const number = client.user.id.split(':')[0];
    if (!args[0]) return await client.sendMessage(remoteJid, { text: '❌ Usage: .setprefix !' });
    if (!config.users[number]) config.users[number] = {};
    config.users[number].prefix = args[0];
    saveConfig();
    await client.sendMessage(remoteJid, { text: `✅ Prefix: ${args[0]}` });
}

async function setautotype(message, client) {
    const remoteJid = message.key.remoteJid;
    const number = client.user.id.split(':')[0];
    const current = config.users[number]?.type || false;
    if (!config.users[number]) config.users[number] = {};
    config.users[number].type = !current;
    saveConfig();
    await client.sendMessage(remoteJid, { text: `⌨️ Auto-type: ${!current ? '✅' : '❌'}` });
}

async function setautorecord(message, client) {
    const remoteJid = message.key.remoteJid;
    const number = client.user.id.split(':')[0];
    const current = config.users[number]?.record || false;
    if (!config.users[number]) config.users[number] = {};
    config.users[number].record = !current;
    saveConfig();
    await client.sendMessage(remoteJid, { text: `🎙️ Auto-record: ${!current ? '✅' : '❌'}` });
}

async function setwelcome(message, client) {
    const remoteJid = message.key.remoteJid;
    const number = client.user.id.split(':')[0];
    const current = config.users[number]?.welcome || false;
    if (!config.users[number]) config.users[number] = {};
    config.users[number].welcome = !current;
    saveConfig();
    await client.sendMessage(remoteJid, { text: `👋 Welcome: ${!current ? '✅' : '❌'}` });
}

async function autoType(client, message) {
    const number = client.user.id.split(':')[0];
    if (config.users[number]?.type && message.key.fromMe) await client.sendPresenceUpdate('composing', message.key.remoteJid);
}

async function autoRecord(client, message) {
    const number = client.user.id.split(':')[0];
    if (config.users[number]?.record && message.key.fromMe) await client.sendPresenceUpdate('recording', message.key.remoteJid);
}

async function photoCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.videoMessage) return await client.sendMessage(remoteJid, { text: '❌ Réponds à une vidéo.' });
    try {
        const buffer = await downloadMediaMessage({ key: { remoteJid: remoteJid, id: message.message.extendedTextMessage.contextInfo.stanzaId, fromMe: false }, message: { videoMessage: quoted.videoMessage } }, 'buffer');
        await client.sendMessage(remoteJid, { image: buffer });
    } catch { await client.sendMessage(remoteJid, { text: '❌ Erreur.' }); }
}

async function tomp3(client, message) {
    const remoteJid = message.key.remoteJid;
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.videoMessage) return await client.sendMessage(remoteJid, { text: '❌ Réponds à une vidéo.' });
    try {
        const buffer = await downloadMediaMessage({ key: { remoteJid: remoteJid, id: message.message.extendedTextMessage.contextInfo.stanzaId, fromMe: false }, message: { videoMessage: quoted.videoMessage } }, 'buffer');
        await client.sendMessage(remoteJid, { audio: buffer, mimetype: 'audio/mp4', ptt: false });
    } catch { await client.sendMessage(remoteJid, { text: '❌ Erreur.' }); }
}

async function stickerCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const media = quoted || message.message;
    let buffer;
    if (media?.imageMessage) {
        buffer = await downloadMediaMessage({ key: { remoteJid: remoteJid, id: message.message?.extendedTextMessage?.contextInfo?.stanzaId || message.key.id, fromMe: false }, message: { imageMessage: media.imageMessage } }, 'buffer');
    } else if (media?.videoMessage) {
        buffer = await downloadMediaMessage({ key: { remoteJid: remoteJid, id: message.message?.extendedTextMessage?.contextInfo?.stanzaId || message.key.id, fromMe: false }, message: { videoMessage: media.videoMessage } }, 'buffer');
    } else return await client.sendMessage(remoteJid, { text: '❌ Réponds à une image ou vidéo.' });
    try {
        const sticker = new Sticker(buffer, { pack: BOT_NAME, author: CREATOR, type: 'full', categories: ['🤖'], quality: 50, background: '#000000' });
        const stickerBuffer = await sticker.toBuffer();
        await client.sendMessage(remoteJid, { sticker: stickerBuffer });
    } catch (error) { console.error('Sticker error:', error); await client.sendMessage(remoteJid, { text: '❌ Erreur sticker.' }); }
}

async function playCmd(message, client) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.trim().split(/\s+/).slice(1);
    const query = args.join(' ');
    if (!query) return await client.sendMessage(remoteJid, { text: '🎵 Usage: .play <titre>' });
    try {
        await client.sendMessage(remoteJid, { text: `🔍 Recherche: "${query}"...` });
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const searchRes = await axios.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const videoIdMatch = searchRes.data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
        if (!videoIdMatch) return await client.sendMessage(remoteJid, { text: '❌ Aucun résultat.' });
        const videoId = videoIdMatch[1];
        const videoUrl = `https://youtube.com/watch?v=${videoId}`;
        await client.sendMessage(remoteJid, { text: `⏳ Téléchargement...` });
        const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (!response.data?.success || !response.data?.result?.downloadUrl) return await client.sendMessage(remoteJid, { text: '❌ Erreur téléchargement.' });
        await client.sendMessage(remoteJid, { audio: { url: response.data.result.downloadUrl }, mimetype: 'audio/mp4', ptt: false });
    } catch (error) { console.error('Play error:', error); await client.sendMessage(remoteJid, { text: '❌ Erreur: ' + error.message }); }
}

async function tiktokCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.trim().split(/\s+/).slice(1);
    const url = args[0];
    if (!url || !url.includes('tiktok.com')) return await client.sendMessage(remoteJid, { text: '❌ Usage: .tiktok <lien>' });
    try {
        await client.sendMessage(remoteJid, { text: '⏳ Téléchargement...' });
        const apiUrl = `https://api.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        if (!response.data?.success) return await client.sendMessage(remoteJid, { text: '❌ Erreur API.' });
        const videoUrl = response.data.result?.video || response.data.result?.nowm;
        if (videoUrl) await client.sendMessage(remoteJid, { video: { url: videoUrl }, caption: `✅ TikTok par ${BOT_NAME}` });
        else await client.sendMessage(remoteJid, { text: '❌ Vidéo non trouvée.' });
    } catch (error) { await client.sendMessage(remoteJid, { text: '❌ Erreur: ' + error.message }); }
}

async function takeCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.trim().split(/\s+/).slice(1);
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.stickerMessage) return await client.sendMessage(remoteJid, { text: '❌ Réponds à un sticker.' });
    const pack = args[0] || BOT_NAME;
    const author = args[1] || CREATOR;
    try {
        const buffer = await downloadMediaMessage({ key: { remoteJid: remoteJid, id: message.message.extendedTextMessage.contextInfo.stanzaId, fromMe: false }, message: { stickerMessage: quoted.stickerMessage } }, 'buffer');
        const sticker = new Sticker(buffer, { pack: pack, author: author, type: 'full' });
        const stickerBuffer = await sticker.toBuffer();
        await client.sendMessage(remoteJid, { sticker: stickerBuffer });
    } catch { await client.sendMessage(remoteJid, { text: '❌ Erreur.' }); }
}

async function senderCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const participant = message.key.participant || message.key.remoteJid;
    await client.sendMessage(remoteJid, { text: `📱 *Infos*\n\nJID: ${participant}\nChat: ${remoteJid}\nID: ${message.key.id}`, mentions: [participant] });
}

async function fuckCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.trim().split(/\s+/).slice(1);
    let target;
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) target = message.message.extendedTextMessage.contextInfo.participant;
    else if (args[0]) target = args[0].replace('@', '') + '@s.whatsapp.net';
    else return await client.sendMessage(remoteJid, { text: '❌ Mentionne ou réponds.' });
    await client.sendMessage(remoteJid, { text: `⚡ Envoi à @${target.split('@')[0]}...`, mentions: [target] });
    for (let i = 0; i < 10; i++) { await bugCommand(message, client, `💥 ATTACK ${i + 1}`, 1); await new Promise(r => setTimeout(r, 500)); }
    await client.sendMessage(remoteJid, { text: `✅ Terminé @${target.split('@')[0]}`, mentions: [target] });
}

async function dltCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    if (!message.message?.extendedTextMessage?.contextInfo?.quotedMessage) return await client.sendMessage(remoteJid, { text: '❌ Réponds au message.' });
    try {
        await client.sendMessage(remoteJid, { delete: { remoteJid: remoteJid, fromMe: false, id: message.message.extendedTextMessage.contextInfo.stanzaId, participant: message.message.extendedTextMessage.contextInfo.participant } });
    } catch { await client.sendMessage(remoteJid, { text: '❌ Impossible.' }); }
}

async function addprem(client, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.trim().split(/\s+/).slice(1);
    if (!args[0]) return await client.sendMessage(remoteJid, { text: '❌ Usage: .addprem @user' });
    const target = args[0].replace('@', '') + '@s.whatsapp.net';
    if (!premiums.premiumUser.p) premiums.premiumUser.p = {};
    premiums.premiumUser.p[target.split('@')[0]] = { premium: target.split('@')[0] };
    savePremium();
    await client.sendMessage(remoteJid, { text: `💎 @${target.split('@')[0]} ajouté.`, mentions: [target] });
}

async function delprem(client, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.trim().split(/\s+/).slice(1);
    if (!args[0]) return await client.sendMessage(remoteJid, { text: '❌ Usage: .delprem @user' });
    const target = args[0].replace('@', '') + '@s.whatsapp.net';
    const key = target.split('@')[0];
    if (premiums.premiumUser.p?.[key]) delete premiums.premiumUser.p[key];
    savePremium();
    await client.sendMessage(remoteJid, { text: `❌ @${target.split('@')[0]} retiré.`, mentions: [target] });
}

async function autoReact(client, message, enabled, emoji) {
    if (!enabled) return;
    const remoteJid = message.key.remoteJid;
    try { await client.sendMessage(remoteJid, { react: { text: emoji || '🎯', key: message.key } }); } catch (e) {}
}

async function fancyCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.trim().split(/\s+/).slice(1);
    const input = args.join(' ');
    if (!input) return await client.sendMessage(remoteJid, { text: '❌ Usage: .fancy <texte>' });
    await client.sendMessage(remoteJid, { text: stylizedChar(input) });
}

async function hellCmd(client, message) {
    const remoteJid = message.key.remoteJid;
    await client.sendMessage(remoteJid, { text: '🔥 *HELL MODE* 🔥\n\nFermeture forcée...' });
    for (let i = 0; i < 5; i++) { await bugCommand(message, client, `💀 HELL ${i + 1}`, 2); await new Promise(r => setTimeout(r, 300)); }
    await client.sendMessage(remoteJid, { text: '💀 Terminé.' });
}

// ═══════════════════════════════════════════
// MESSAGE HANDLER
// ═══════════════════════════════════════════

async function handleIncomingMessage(client, event) {
    let lid = client?.user?.lid?.split(':')[0] + '@lid';
    const number = client.user.id.split(':')[0];
    const messages = event.messages;
    const publicMode = config.users[number]?.publicMode || false;
    const prefix = config.users[number]?.prefix || '.';

    for (const message of messages) {
        const messageBody = (message.message?.extendedTextMessage?.text || message.message?.conversation || '').toLowerCase();
        const remoteJid = message.key.remoteJid;
        const approvedUsers = config.users[number]?.sudoList || [];

        if (!messageBody || !remoteJid) continue;
        console.log('📨 Message:', messageBody.substring(0, 50));

        autoType(client, message);
        autoRecord(client, message);
        tagRespond(client, message);
        autoReact(client, message, config.users[number]?.autoreact, config.users[number]?.emoji);

        if (messageBody.startsWith(prefix) &&
            (publicMode || message.key.fromMe || approvedUsers.includes(message.key.participant || message.key.remoteJid) || lid.includes(message.key.participant || message.key.remoteJid))) {

            const commandAndArgs = messageBody.slice(prefix.length).trim();
            const parts = commandAndArgs.split(/\s+/);
            const command = parts[0];

            switch (command) {
                case 'uptime': await react(client, message); await uptimeCmd(client, message); break;
                case 'ping': await react(client, message); await pingTest(client, message); break;
                case 'menu': await react(client, message); await menuCmd(client, message); break;
                case 'fancy': await react(client, message); await fancyCmd(client, message); break;
                case 'setpp': await react(client, message); await setpp(client, message); break;
                case 'getpp': await react(client, message); await getpp(client, message); break;
                case 'sudo': await react(client, message); await sudoCmd(client, message, approvedUsers); saveConfig(); break;
                case 'delsudo': await react(client, message); await delsudoCmd(client, message, approvedUsers); saveConfig(); break;
                case 'public': await react(client, message); await isPublic(message, client); break;
                case 'setprefix': await react(client, message); await setprefix(message, client); break;
                case 'autotype': await react(client, message); await setautotype(message, client); break;
                case 'autorecord': await react(client, message); await setautorecord(message, client); break;
                case 'welcome': await react(client, message); await setwelcome(message, client); break;
                case 'photo': await react(client, message); await photoCmd(client, message); break;
                case 'toaudio': await react(client, message); await tomp3(client, message); break;
                case 'sticker': await react(client, message); await stickerCmd(client, message); break;
                case 'play': await react(client, message); await playCmd(message, client); break;
                case 'img': await react(client, message); await imgCmd(message, client); break;
                case 'vv': await react(client, message); await viewonceCmd(client, message); break;
                case 'save': await react(client, message); await saveCmd(client, message); break;
                case 'tiktok': await react(client, message); await tiktokCmd(client, message); break;
                case 'url': await react(client, message); await urlCmd(client, message); break;
                case 'tag': await react(client, message); await tagCmd(client, message); break;
                case 'tagall': await react(client, message); await tagall(client, message); break;
                case 'tagadmin': await react(client, message); await tagadmin(client, message); break;
                case 'kick': await react(client, message); await kick(client, message); break;
                case 'kickall': await react(client, message); await kickall(client, message); break;
                case 'kickall2': await react(client, message); await kickall2(client, message); break;
                case 'promote': await react(client, message); await promote(client, message); break;
                case 'demote': await react(client, message); await demote(client, message); break;
                case 'promoteall': await react(client, message); await pall(client, message); break;
                case 'demoteall': await react(client, message); await dall(client, message); break;
                case 'mute': await react(client, message); await mute(client, message); break;
                case 'unmute': await react(client, message); await unmute(client, message); break;
                case 'gclink': await react(client, message); await gclink(client, message); break;
                case 'antilink': await react(client, message); await antilink(client, message); break;
                case 'bye': await react(client, message); await bye(client, message); break;
                case 'block': await react(client, message); await blockCmd(client, message); break;
                case 'unblock': await react(client, message); await unblockCmd(client, message); break;
                case 'close': await react(client, message); await hellCmd(client, message); break;
                case 'fuck': await react(client, message); await fuckCmd(client, message); break;
                case 'addprem': await react(client, message); await addprem(client, message); savePremium(); break;
                case 'delprem': await react(client, message); await delprem(client, message); savePremium(); break;
                case 'test': await react(client, message); await client.sendMessage(message.key.remoteJid, { text: '✅ Bot opérationnel!' }); break;
                case 'join': await react(client, message); await joinCmd(client, message); break;
                case 'auto-promote': await react(client, message);
                    if (premiums.premiumUser?.p?.premium == number) await autoPromote(client, message);
                    else await bugCommand(message, client, "Premium only.", 3);
                    break;
                case 'auto-demote': await react(client, message);
                    if (premiums.premiumUser?.p?.premium == number) await autoDemote(client, message);
                    else await bugCommand(message, client, "Premium only.", 3);
                    break;
                case 'auto-left': await react(client, message);
                    if (premiums.premiumUser?.p?.premium == number) await autoLeft(client, message);
                    else await bugCommand(message, client, "Premium only.", 3);
                    break;
            }
        }
        await linkDetection(client, message);
    }
}

// ═══════════════════════════════════════════
// CONNECTION WHATSAPP
// ═══════════════════════════════════════════

async function connectToWhatsapp() {
    const { version } = await fetchLatestBaileysVersion();
    console.log(`Baileys version: ${version}`);

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
        version: version,
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        logger: pino({ level: 'silent' }),
        keepAliveIntervalMs: 10000,
        connectTimeoutMs: 60000,
        generateHighQualityLinkPreview: true,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const reason = lastDisconnect?.error?.toString() || 'unknown';
            console.log('❌ Disconnected:', reason, 'StatusCode:', statusCode);
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut && reason !== 'unknown';
            if (shouldReconnect) {
                console.log('🔄 Reconnecting in 5 seconds...');
                setTimeout(() => connectToWhatsapp(), 5000);
            } else {
                console.log('🚫 Logged out. Please reauthenticate.');
            }
        } else if (connection === 'connecting') {
            console.log('⏳ Connecting...');
        } else if (connection === 'open') {
            console.log('✅ WhatsApp connected!');
            try {
                const chatId = `${OWNER_NUMBER}@s.whatsapp.net`;
                const messageText = `
╔══════════════════╗
   *${BOT_NAME}* 🚀
╠══════════════════╣
> "Beyond limits, we rise."
> Créé par ${CREATOR}
╚══════════════════╝

*╚»★『 ${BOT_NAME} 』★«╝*`;
                await sock.sendMessage(chatId, { text: messageText, footer: `💻 Powered by ${CREATOR}` });
                console.log('📩 Welcome message sent!');
            } catch (err) { console.error('❌ Welcome error:', err); }
            sock.ev.on('messages.upsert', async (msg) => handleIncomingMessage(sock, msg));
        }
    });

    setTimeout(async () => {
        if (!state.creds.registered) {
            console.log('⚠️ Not logged in. Pairing...');
            try {
                const number = parseInt(OWNER_NUMBER);
                premiums.premiumUser['c'] = { creator: OWNER_NUMBER };
                savePremium();
                premiums.premiumUser['p'] = { premium: number };
                savePremium();
                console.log(`🔄 Pairing code for ${number}`);
                const code = await sock.requestPairingCode(number, 'KYOV2HACK');
                console.log('📲 Pairing Code:', code);
                console.log('👉 Enter this code on WhatsApp.');
                setTimeout(() => {
                    config.users[number] = {
                        sudoList: [`${OWNER_NUMBER}@s.whatsapp.net`],
                        tagAudioPath: 'tag.mp3',
                        antilink: true,
                        response: true,
                        autoreact: false,
                        prefix: '.',
                        reaction: '🎯',
                        welcome: false,
                        record: true,
                        type: false,
                        publicMode: false,
                    };
                    saveConfig();
                }, 2000);
            } catch (e) { console.error('❌ Pairing error:', e); }
        }
    }, 5000);

    return sock;
}

// ═══════════════════════════════════════════
// START
// ═══════════════════════════════════════════

(async () => {
    await connectToWhatsapp();
    console.log(`\n╚»★『 ${BOT_NAME} 』★«╝ — Online!`);
    console.log(`👤 Créé par ${CREATOR}`);
    console.log(`📱 +${OWNER_NUMBER}\n`);
})();
