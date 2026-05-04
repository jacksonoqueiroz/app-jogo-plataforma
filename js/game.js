document.addEventListener("fullscreenchange", resizeCanvas);
document.addEventListener("webkitfullscreenchange", resizeCanvas);
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== RESOLUÇÃO BASE DO JOGO =====
const BASE_WIDTH = 1024;
const BASE_HEIGHT = 576;

// bloqueia menu de copiar/colar
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// mantém lógica fixa
canvas.width = BASE_WIDTH;
canvas.height = BASE_HEIGHT;

// escala visual
function resizeCanvas() {
    const scale = Math.min(
        window.innerWidth / BASE_WIDTH,
        window.innerHeight / BASE_HEIGHT
    );

    canvas.style.width = BASE_WIDTH * scale + "px";
    canvas.style.height = BASE_HEIGHT * scale + "px";

    // 🔥 FORÇA REDRAW (IMPORTANTE)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// DETECTAR MOBILE
const isMobile = window.innerWidth < 768;

// PLAYER GLOBAL
const player = new Player(100, 450);

// MUNDO
const worldWidth = 3000;

// CÂMERA
let cameraX = 0;

// PLATAFORMAS
const platforms = [
    { x: 0, y: 500, width: 3000, height: 50 },

    { x: 400, y: 400, width: 200, height: 20 },
    { x: 800, y: 350, width: 200, height: 20 },
    { x: 1200, y: 300, width: 200, height: 20 },
    { x: 1600, y: 250, width: 200, height: 20 },
    { x: 2000, y: 200, width: 200, height: 20 }
];

// ===== TOUCH CONTROLS =====
const touch = {
    left: false,
    right: false
};

if (isMobile) {
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");
    const btnJump = document.getElementById("btnJump");

    if (btnLeft && btnRight && btnJump) {

        // ESQUERDA
        btnLeft.addEventListener("touchstart", (e) => {
            e.preventDefault();
            touch.left = true;
        });

        btnLeft.addEventListener("touchend", (e) => {
            e.preventDefault();
            touch.left = false;
        });

        // DIREITA
        btnRight.addEventListener("touchstart", (e) => {
            e.preventDefault();
            touch.right = true;
        });

        btnRight.addEventListener("touchend", (e) => {
            e.preventDefault();
            touch.right = false;
        });

        // PULO
        btnJump.addEventListener("touchstart", (e) => {
            e.preventDefault();
            player.jump();
        });

        btnLeft.addEventListener("touchcancel", () => touch.left = false);
        btnRight.addEventListener("touchcancel", () => touch.right = false);
    }
}

// ===== LOOP =====
function gameLoop() {

    
    // LIMPA TELA
    ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    // FUNDO
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    // PARALLAX
    ctx.fillStyle = "#333";
    for (let i = 0; i < 10; i++) {
        let x = i * 400 - cameraX * 0.3;
        ctx.fillRect(x, 350, 300, 200);
    }

    // ===== CONTROLE =====
    if (keys.left || touch.left) player.moveLeft();
    if (keys.right || touch.right) player.moveRight();

    // UPDATE PLAYER
    player.update(platforms);

    // CÂMERA SEGUE PLAYER
    cameraX = player.x + player.width / 2 - BASE_WIDTH / 2;

    // LIMITES DA CÂMERA
    if (cameraX < 0) cameraX = 0;
    if (cameraX > worldWidth - BASE_WIDTH) {
        cameraX = worldWidth - BASE_WIDTH;
    }

    // DESENHAR PLATAFORMAS
    ctx.fillStyle = "brown";
    platforms.forEach((p) => {
        ctx.fillRect(
            p.x - cameraX,
            p.y,
            p.width,
            p.height
        );
    });

    // DESENHAR PLAYER
    player.draw(ctx, cameraX);

    requestAnimationFrame(gameLoop);
}

function checkOrientation() {
    const isMobile = window.innerWidth < 768;

    if (isMobile && window.innerHeight > window.innerWidth) {
        document.getElementById("rotateMessage").style.display = "flex";
        canvas.style.display = "none";
    } else {
        document.getElementById("rotateMessage").style.display = "none";
        canvas.style.display = "block";
    }
}

// ===== FULLSCREEN MOBILE =====
function enableFullscreen() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE11
        elem.msRequestFullscreen();
    }
}

// ativa fullscreen no PRIMEIRO TOQUE
function setupFullscreenOnTouch() {
    let activated = false;

    function trigger() {
        if (!activated) {
            enableFullscreen();
            activated = true;

            // remove depois de ativar
            window.removeEventListener("touchstart", trigger);
            window.removeEventListener("click", trigger);
        }
    }

    window.addEventListener("touchstart", trigger);
    window.addEventListener("click", trigger);
}

// só ativa em mobile
function forceMobileFullscreen() {
    // força ocupar tela toda
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";

    canvas.style.position = "fixed";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";

    // força recalcular tamanho
    resizeCanvas();

    // hack pra esconder barra do Safari
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 100);
}

// ativa no primeiro toque
function setupMobileFullscreen() {
    let activated = false;

    function trigger() {
        if (!activated) {
            forceMobileFullscreen();
            activated = true;

            window.removeEventListener("touchstart", trigger);
        }
    }

    window.addEventListener("touchstart", trigger);
}

function forceMobileFullscreen() {
    // força ocupar tela toda
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";

    canvas.style.position = "fixed";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";

    // força recalcular tamanho
    resizeCanvas();

    // hack pra esconder barra do Safari
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 100);
}

// ativa no primeiro toque
function setupMobileFullscreen() {
    let activated = false;

    function trigger() {
        if (!activated) {
            forceMobileFullscreen();
            activated = true;

            window.removeEventListener("touchstart", trigger);
        }
    }

    window.addEventListener("touchstart", trigger);
}

// só mobile
if (window.innerWidth < 768) {
    setupMobileFullscreen();
}

// só mobile
if (window.innerWidth < 768) {
    setupMobileFullscreen();
}

// ===== BOTÃO FULLSCREEN (SEGURO) =====
window.addEventListener("load", () => {

    const btnFullscreen = document.getElementById("btnFullscreen");

    if (!btnFullscreen) return;

    function isRunningAsApp() {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true
        );
    }

    function isFullscreen() {
        return document.fullscreenElement ||
               document.webkitFullscreenElement;
    }

    function updateButton() {
        // 🔥 se for app instalado ou fullscreen → some
        if (isRunningAsApp() || isFullscreen()) {
            btnFullscreen.style.display = "none";
        } else {
            btnFullscreen.style.display = "block";
        }
    }

    // clique no botão
    btnFullscreen.addEventListener("click", () => {
        enableFullscreen();

        // pequeno delay pra garantir atualização
        setTimeout(updateButton, 300);
    });

    // eventos seguros
    document.addEventListener("fullscreenchange", updateButton);
    document.addEventListener("webkitfullscreenchange", updateButton);

    // roda ao carregar
    updateButton();
});

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);

gameLoop();