class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = 50;
        this.height = 50;

        this.velocityX = 0;
        this.velocityY = 0;

        this.acceleration = 0.5;
        this.maxSpeed = 6;
        this.friction = 0.8;

        this.gravity = 0.5;
        this.jumpForce = -12;

        this.onGround = false;

        // ===== SPRITE =====
        this.image = new Image();
        this.image.src = "./assets/images/player.png";

        this.frameWidth = 32;
        this.frameHeight = 32;

        this.totalFrames = 4;
        this.currentFrame = 0;

        this.frameDelay = 8;
        this.frameCounter = 0;

        this.direction = "right";

        //======== FRAMES =======
        this.animations = {
            idle: { frames: 1, row: 0 },
            run: { frames: 4, row: 0 },
            jump: { frames: 1, row: 1 },
            fall: { frames: 1, row: 2 }
        };
        
        this.currentAnimation = "idle";
        this.state = "idle"; // idle, run, jump

        this.totalFrames = 5; // total do sprite
        this.currentFrame = 0;

        this.frameDelay = 8;
        this.frameCounter = 0;

        this.state = "idle";

    }

    update(platforms) {

        // ===== GRAVIDADE =====
        this.velocityY += this.gravity;

        // ===== MOVIMENTO HORIZONTAL =====
        this.x += this.velocityX;

        // COLISÃO HORIZONTAL
        platforms.forEach((p) => {
            if (
                this.x < p.x + p.width &&
                this.x + this.width > p.x &&
                this.y < p.y + p.height &&
                this.y + this.height > p.y
            ) {
                if (this.velocityX > 0) {
                    this.x = p.x - this.width;
                    this.velocityX = 0;
                }
                if (this.velocityX < 0) {
                    this.x = p.x + p.width;
                    this.velocityX = 0;
                }
            }
        });

        // ===== MOVIMENTO VERTICAL =====
        let prevY = this.y;
        this.y += this.velocityY;

        this.onGround = false;

        platforms.forEach((p) => {

            if (
                this.x + this.width > p.x &&
                this.x < p.x + p.width
            ) {

                // CAINDO EM CIMA
                if (
                    prevY + this.height <= p.y &&
                    this.y + this.height >= p.y
                ) {
                    this.y = p.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                }

                // BATENDO CABEÇA
                else if (
                    prevY >= p.y + p.height &&
                    this.y <= p.y + p.height
                ) {
                    this.y = p.y + p.height;
                    this.velocityY = 0;
                }
            }
        });

        // ===== ATRITO =====
        if (this.onGround) {
            this.velocityX *= this.friction;
        }

        if (Math.abs(this.velocityX) < 0.1) {
            this.velocityX = 0;
        }

        // ===== ESTADO =====
        if (!this.onGround) {

            if (this.velocityY < 0) {
                this.state = "jump"; // subindo
            } else {
                this.state = "fall"; // descendo
            }

        } else if (Math.abs(this.velocityX) > 0.2) {

            this.state = "run";

        } else {

            this.state = "idle";
        }

        // ===== DEFINIR ESTADO =====
    if (!this.onGround) {
        if (this.velocityY < 0) {
            this.currentAnimation = "jump";
        } else {
            this.currentAnimation = "fall";
        }
    } else if (this.velocityX !== 0) {
        this.currentAnimation = "run";
    } else {
        this.currentAnimation = "idle";
    }

    // ===== ESTADO =====
    if (!this.onGround) {
        this.state = "jump";
    } else if (this.velocityX !== 0) {
        this.state = "run";
    } else {
        this.state = "idle";
    }

    // ===== ANIMAR =====
    const anim = this.animations[this.currentAnimation];

    this.frameCounter++;

    // ===== ANIMAÇÃO =====

        if (this.state === "run") {

            this.frameCounter++;

            if (this.frameCounter >= this.frameDelay) {
                this.currentFrame++;
                this.frameCounter = 0;

                // frames 1 até 3
                if (this.currentFrame < 1 || this.currentFrame > 3) {
                    this.currentFrame = 1;
                }
            }

        } else if (this.state === "jump") {

            this.currentFrame = 4; // último frame

        } else if (this.state === "fall") {

            this.currentFrame = 4; // pode usar o mesmo por enquanto

        } else {

            this.currentFrame = 0; // idle
        }
        // ===== DIREÇÃO =====
        if (this.velocityX > 0) this.direction = "right";
        if (this.velocityX < 0) this.direction = "left";

        // ===== LIMITES =====
        if (this.x < 0) this.x = 0;

        const worldWidth = 3000;
        if (this.x + this.width > worldWidth) {
            this.x = worldWidth - this.width;
        }

        // RESET QUEDA
        if (this.y > 1000) {
            this.x = 100;
            this.y = 450;
            this.velocityY = 0;
        }
    }

    draw(ctx, cameraX = 0) {

        // ⚠️ SE IMAGEM NÃO CARREGOU, DESENHA QUADRADO (DEBUG)
        if (!this.image.complete) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
            return;
        }

        ctx.save();

        if (this.direction === "left") {
            ctx.scale(-1, 1);

            ctx.drawImage(
                this.image,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.frameHeight,
                -(this.x - cameraX) - this.width,
                this.y,
                this.width,
                this.height
            );
        } else {
            ctx.drawImage(
                this.image,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.frameHeight,
                this.x - cameraX,
                this.y,
                this.width,
                this.height
            );
        }

        ctx.restore();
    }

    moveLeft() {
        this.velocityX -= this.acceleration;
        if (this.velocityX < -this.maxSpeed) {
            this.velocityX = -this.maxSpeed;
        }
    }

    moveRight() {
        this.velocityX += this.acceleration;
        if (this.velocityX > this.maxSpeed) {
            this.velocityX = this.maxSpeed;
        }
    }

    jump() {
        if (this.onGround) {
            this.velocityY = this.jumpForce;
        }
    }
}