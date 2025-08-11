// PWA Install Prompt
let deferredPrompt;
let isInstalled = false;

// Check if app is already installed
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA: beforeinstallprompt event fired');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

// Check if app is launched in standalone mode
window.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        console.log('PWA: App is running in standalone mode');
        isInstalled = true;
    } else {
        console.log('PWA: App is running in browser mode');
        // Show install prompt after a delay
        setTimeout(showInstallPrompt, 3000);
    }
});

function showInstallButton() {
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', installApp);
    }
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('PWA: User accepted the install prompt');
            } else {
                console.log('PWA: User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    } else {
        // Fallback for browsers that don't support beforeinstallprompt
        showManualInstallInstructions();
    }
}

function showInstallPrompt() {
    if (isInstalled || deferredPrompt) return;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS || isAndroid) {
        showMobileInstallBanner();
    }
}

function showMobileInstallBanner() {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: Inter, sans-serif;
            backdrop-filter: blur(10px);
        ">
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px;">📱 Installa GestionaleRK</div>
                <div style="font-size: 14px; opacity: 0.9;">Aggiungi alla schermata Home per un accesso rapido</div>
            </div>
            <div>
                <button id="install-now" style="
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    margin-right: 8px;
                    cursor: pointer;
                ">Installa</button>
                <button id="close-banner" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 8px;
                ">×</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    document.getElementById('install-now').addEventListener('click', () => {
        if (deferredPrompt) {
            installApp();
        } else {
            showManualInstallInstructions();
        }
        banner.remove();
    });
    
    document.getElementById('close-banner').addEventListener('click', () => {
        banner.remove();
    });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (document.getElementById('pwa-install-banner')) {
            banner.remove();
        }
    }, 10000);
}

function showManualInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    
    if (isIOS) {
        instructions = `
            Su iPhone/iPad:
            1. Tocca il pulsante "Condividi" 📤 in basso
            2. Scorri e trova "Aggiungi alla schermata Home"
            3. Tocca "Aggiungi" per installare l'app
        `;
    } else if (isAndroid) {
        instructions = `
            Su Android:
            1. Tocca il menu del browser (⋮)
            2. Cerca "Aggiungi alla schermata Home" o "Installa app"
            3. Conferma per installare l'app
        `;
    } else {
        instructions = `
            Su questo dispositivo:
            1. Cerca l'icona di installazione nella barra degli indirizzi
            2. Oppure vai nel menu del browser
            3. Cerca "Installa app" o "Aggiungi alla schermata Home"
        `;
    }
    
    alert(`📱 Come installare GestionaleRK:\n\n${instructions}\n\nL'app si aprirà come un'applicazione nativa!`);
}