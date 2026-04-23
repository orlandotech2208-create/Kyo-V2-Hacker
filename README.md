# ╚»★『 ᏦᎽᎾ_𝐕𝟐_𝐇𝐀𝐂𝐊𝐄𝐑 』★«╝

**Bot WhatsApp ultime — Version TERMUX**

👤 **Créé par:** Orlando-tech  
📱 **Contact:** +50935443504  
🚀 **Version:** 2.0.0-Termux

---

## ⚠️ Version spéciale Termux

Cette version est optimisée pour **Termux sur Android**. Elle n'utilise **pas** `wa-sticker-formatter` (qui cause des erreurs avec `sharp`/`libvips` sur Android).

---

## 🚀 Installation sur Termux

```bash
# 1. Mettre à jour Termux
pkg update && pkg upgrade -y

# 2. Installer Node.js
pkg install nodejs -y

# 3. Cloner le repo
git clone https://github.com/orlandotech2208-create/Kyo-V2-Hacker.git
cd Kyo-V2-Hacker

# 4. Installer les dépendances
npm install

# 5. Lancer le bot
npm start
```

### 6. Authentification
- Un **code de pairing** s'affichera dans le terminal
- Ouvre WhatsApp → Paramètres → Appareils liés → Lier avec numéro de téléphone
- Entre le code affiché

---

## 📋 Commandes disponibles

| Catégorie | Commandes |
|-----------|-----------|
| **Utils** | `.ping`, `.uptime`, `.menu`, `.fancy`, `.setpp`, `.getpp` |
| **Media** | `.photo`, `.toaudio`, `.sticker`, `.play`, `.img`, `.vv`, `.save`, `.tiktok`, `.url` |
| **Groupe** | `.tag`, `.tagall`, `.tagadmin`, `.kick`, `.kickall`, `.kickall2`, `.promote`, `.demote`, `.promoteall`, `.demoteall`, `.mute`, `.unmute`, `.gclink`, `.antilink`, `.bye`, `.join` |
| **Modération** | `.block`, `.unblock` |
| **Bug** | `.close`, `.fuck` |
| **Owner** | `.sudo`, `.delsudo` |
| **Premium** | `.addprem`, `.delprem`, `.auto-promote`, `.auto-demote`, `.auto-left` |
| **Settings** | `.public`, `.setprefix`, `.autotype`, `.autorecord`, `.welcome` |

---

## ⚙️ Configuration

Modifie ces constantes en haut de `index.js` :
```javascript
const OWNER_NUMBER = '50935443504';  // Ton numéro
const BOT_NAME = 'ᏦᎽᎾ_𝐕𝟐_𝐇𝐀𝐂𝐊𝐄𝐑';
const CREATOR = 'Orlando-tech';
```

---

> **"Beyond limits, we rise."** — Orlando-tech
