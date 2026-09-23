# PAPIO Web Flasher

Flasheur web dédié au **LILYGO T-Embed CC1101 Plus**.

## Firmware inclus

- Fichier : `papio.bin`
- Taille : 4,230,880 octets
- SHA-256 : `bfa2d5adb465eabeedf357aa5d4aa0e139f3651bfbb1a8dc09d613af04827c3a`
- Cible : ESP32-S3
- Flash : 16 MB
- Adresse utilisée : `0x00000000`

Le binaire fourni contient une image ESP et une seconde image à `0x10000`, avec une table de partitions à `0x8000`. Le site le traite donc comme une image fusionnée et l'écrit depuis `0x0`.

## Utilisation

1. Héberger ce dossier sur un site HTTPS, ou lancer un serveur local.
2. Utiliser Chrome ou Edge avec Web Serial.
3. Brancher le T-Embed CC1101 Plus en USB.
4. Cliquer sur **CONNECT DEVICE**.
5. Mettre la carte en mode bootloader si elle n'est pas détectée automatiquement.
6. Cliquer sur **FLASH PAPIO**.

L'option **Clean install** efface toute la flash avant l'écriture : elle est volontairement désactivée par défaut.

## Dépendance

Le site utilise `esptool-js` 0.6.1 depuis le CDN officiel du projet Espressif.
