const keys = {
    left: false,
    right: false
};

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") {
        keys.left = true;
    }

    if (e.key === "ArrowRight" || e.key === "d") {
        keys.right = true;
    }

    if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        player.jump();
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") {
        keys.left = false;
    }
    if (e.key === "ArrowRight" || e.key === "d") {
        keys.right = false;
    }
});