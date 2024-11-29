npx create-next-app@latest   --> i
    nstall command
ls   --> 
    terminal – show root, vypis directiories
cd --> 
    change directory
cd .. --> 
    posunie nas o uroven vyzsie
npm run dev --> 
    zapinanie projektu
npm install @mui/material @emotion/react @emotion/styled --> 
    install mui libarry (html a css)
<<<<<<< HEAD

=======
git init --> 
    inicializacia gitu
git branch -m <name> --> 
    zmeni meno git main brainchu
git config --global user.name "your name“ --> 
    nastavime user name
git config --global user.email "your email" --> 
    nastavime user email
git remote add origin https://github.com/your_username/project_name.git --> 
    nastavite svoj projekt
git add . --> 
    vlozite vsetky files z filu, ktory ste nastavili
git commit -m "Initial commit" --> 
    commit changes
>>>>>>> f57f7b73083d9fc3dfefcdd8efdd5370bfb93a4b

- Node js vzdy zobrazuje stranku, ktora sa musi volat page.tsx a musi byt v app priecinku. Ako home stranku zobrazu tu, ktora je len v app priecinku a nie je zabalena nejakym inym priecinkom. Preto na home priecinok dame () --> (home) lebo router home priecinok „nevidi“ ak je v zatvrokach a page vnom zonbere ako default.

Next.js rezervovane nazvy --> layout.tsx, not-found.tsx, page.tsx

-routing --> 
npm run build --> skompiluje a vytvori production server na localhoste, vzdy zapnut pred commit/sync aby sa errors nedostali na production server

- vypise vsetky folders a files okrem .next, node_modules, .git -->
    ind . -path './.next' -prune -o -path './node_modules' -prune -o -path './.git' -prune -o -print | sed -e "s/[^\/]*// |/g" -e "s/|([^ ])/|-\1/"


npm run dev --> zapinanie projektu
npm install @mui/material @emotion/react @emotion/styled --> install mui libarry (html a css)
git init --> inicializacia gitu
git branch -m <name> --> zmeni meno git main brainchu
git config --global user.name "your name“ --> nastavime user name
git config --global user.email "your email" --> nastavime user email
git remote add origin https://github.com/your_username/project_name.git --> nastavite svoj projekt
git add . --> vlozite vsetky files z filu, ktory ste nastavili
git commit -m "Initial commit" --> commit changes





Prejdi do Google Developer Console

Vytvor nový projekt alebo vyber existujúci projekt

V sekcii APIs & Services klikni na Credentials (Prihlásenie)

V sekcii OAuth 2.0 Client IDs klikni na Create Credentials (Vytvoriť prihlasovacie údaje)

Vyber možnosť OAuth client ID (OAuth klient ID)

Nastav typ aplikácie na Web Application (Webová aplikácia)

Pridaj nasledujúcu redirect URI (adresu pre presmerovanie):

    http://localhost:3000/api/auth/callback/google



Set up .env

    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    NEXTAUTH_URL=http://localhost:3000  #alebo production URL

V0 - vercel AI

Material UI - library


============
MY .env FILE:
============

#GOOGLE 
GOOGLE_CLIENT_ID=145302857586-b57nl0a517bdvc160o8v3a1nabkjgif0.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=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

#FACEBOOK

FACEBOOK_CLIENT_ID=888952336679431

FACEBOOK_CLIENT_SECRET=c2fba61377be0abaf63ada1d327a26e3

#INSTAGRAM 

INSTAGRAM_CLIENT_ID=600941445702100

INSTAGRAM_CLIENT_SECRET=b3637b79fd9b64af7b0e80d58f864143

#HOST

NEXTAUTH_URL=https://jakub-gram-1.vercel.app  #alebo production URL

NEXTAUTH_SECRET=e8b144zzzj4x6ns8sz45q9aml56n7a66473ayhgd5dc4q0tdedz8pjbwwmp3ow6f

#DATABASE

DATABASE_URL=postgres://neondb_owner:8vOKXAdsE1Pj@ep-summer-cloud-a23ejzz2-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require


