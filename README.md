# PAPIO — Bruce Mod avec IA & Jeux

Un firmware basé sur [Bruce](https://github.com/pr3y/Bruce), le firmware ESP32 open-source à tout faire, adapté pour le **Lilygo T-Embed CC1101 Plus**.

Cette version garde toute la puissance de Bruce et y ajoute une interface repensée, un chatbot IA intégré et des mini-jeux jouables directement sur l'appareil.

![Bruce Mod Banner]

## ✨ Nouveautés par rapport à Bruce original

- 🎨 **Interface revue** — menus retravaillés, meilleure lisibilité sur l'écran du T-Embed, navigation plus fluide
- 🤖 **Chatbot IA intégré** — assistant conversationnel via l'API Groq, directement accessible depuis le menu principal
- 🎮 **Mini-jeux** — Snake, Tetris et d'autres classiques, jouables au clavier/joystick de l'appareil
- 🛠️ Toutes les fonctionnalités offensives/red team de Bruce restent disponibles (WiFi, BLE, RF, IR, NFC, etc.)

## 📷 Aperçu

| Menu principal | Chat IA | Jeux |
|---|---|---|


## 🔧 Matériel supporté

- **Lilygo T-Embed CC1101 Plus** (cible principale de ce fork)

## 🚀 Installation

### Flash rapide (recommandé) — aucune commande nécessaire
Pas besoin d'installer quoi que ce soit ni de taper la moindre commande : tout se fait dans le navigateur.

👉 **[luisdu26.github.io/papio](https://luisdu26.github.io/papio/)**

1. Ouvrez le site avec **Chrome** ou **Edge** (nécessaire pour le Web Serial)
2. Branchez votre **T-Embed CC1101 Plus** en USB
3. Cliquez sur **Connect Device** et sélectionnez le port série
4. Cliquez sur **Flash PAPIO**

C'est tout — le firmware est flashé directement depuis le site, sans ligne de commande.

### Compilation depuis les sources

```bash
git clone https://github.com/<ton-user>/<ton-repo>.git
cd <ton-repo>
# build avec PlatformIO
pio run -e t-embed-cc1101plus
pio run -e t-embed-cc1101plus -t upload
```

## 🤖 Configurer le chatbot IA

Le chatbot utilise l'API [Groq] une clef est deja dans le firmware

## 🎮 Jeux disponibles

- 🐍 Snake
- 🧱 Tetris
- *(ajoute ici les autres jeux au fur et à mesure)*

Accessibles depuis le menu **Games** du menu principal.

## 🙏 Crédits

- Ce projet est un fork de [Bruce](https://github.com/pr3y/Bruce) par pr3y et les contributeurs de la communauté Bruce
- Chatbot propulsé par l'API [Groq](https://groq.com/)

## ⚠️ Avertissement

Comme le projet original, ce firmware inclut des fonctionnalités offensives de sécurité (WiFi, BLE, RF, etc.) destinées **uniquement** à des tests de sécurité légaux et autorisés. Toute utilisation malveillante ou non autorisée est strictement interdite. Utilisation à tes propres risques.

## 📄 Licence

Distribué sous licence **AGPL-3.0**, comme le projet Bruce original.
