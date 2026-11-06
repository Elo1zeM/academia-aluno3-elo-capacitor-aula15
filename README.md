# 🐝 Academia FitZone

Aplicação responsiva de academia, desenvolvida com React, Vite e Capacitor. O projeto funciona como site no computador/celular e como aplicativo Android com notificações locais.

## Tecnologias
- React + Vite
- CSS responsivo
- Capacitor 8
- `@capacitor/local-notifications`
- GitHub Actions (site e APK)

## Executar no computador
```bash
npm install
npm run dev
```
Abra o endereço local mostrado pelo Vite (normalmente http://localhost:5173).

## Gerar APK localmente
```bash
npm install
npm run build
npx cap add android
npx cap sync android
npm run android:prepare
```
Depois abra a pasta `android` no Android Studio ou compile com:
```bash
cd android
./gradlew assembleDebug
```
APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## Gerar APK na nuvem
Envie o projeto para a branch `main`. No GitHub, abra **Actions**, selecione **Construir APK Android - Academia FitZone**, abra a execução concluída e baixe o artifact `academia-fitzone-apk`.

## Publicar o site
No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** como Build and deployment source. O workflow `deploy-pages.yml` publicará o site em:
`https://SEU-USUARIO.github.io/academia-3-elo/`

## Notificações
As notificações locais são nativas e devem ser testadas no APK Android. No navegador, a interface do site continua funcionando, mas os botões informam que a função nativa requer o aplicativo. O Android 13 ou superior solicita permissão de notificações ao usuário.

O projeto inclui um arquivo de som WAV personalizado em `assets/fitzone_alert.wav`, copiado para os recursos Android durante a compilação. O canal Android usa esse som; o comportamento também depende das configurações de notificação do dispositivo.

## Evidências para a entrega
Adicione ao README capturas de tela do site em desktop e celular, além de um vídeo/GIF demonstrando a notificação no Android.
