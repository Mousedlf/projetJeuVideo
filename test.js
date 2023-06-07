// initialize context
kaboom({
    scale:1,
    debug: true,

});


//load assets
loadSprite("playerRed", "sprites/playerRed.png");
loadSprite("playerBlue", "sprites/playerBlue.png");

loadSprite("brickLight", "sprites/brickLight.png");
loadSprite("lift", "sprites/waterblock.png");
loadSprite("button", "sprites/brickLight.png");

loadSprite("box", "sprites/box.png");
loadSprite("doorR", "sprites/doorR.png");
loadSprite("doorB", "sprites/doorB.png");

loadSprite("diamondR", "sprites/diamondR.png");
loadSprite("diamondB", "sprites/diamondB.png");

loadSprite("lava", "sprites/lavablock.png");
loadSprite("water", "sprites/waterblock.png");
loadSprite("acid", "sprites/green.png");


//AUTRE
setGravity(600)
setBackground(220,220,220,0)


const SPEED = 150
const JUMP_FORCE = 300
const PLATFORM_SPEED = 5


//niveaux
const LEVELS = [
    [
        '========================================',
        '= =                                    =',
        '= =                              !   ? =',
        '= =         ============================',
        '= =  +                                 =',
        '= =====                                =',
        '= =====                                =',
        '= =====        ===xx======             =',
        '= =========aa===================       =',
        '= =                                    =',
        '= =               *                    =',
        '= =      ==============         -      =',
        '=       =             ==================',
        '=                                =======',
        '======      .                        ===',
        '==================                     =',
        '=======================oo=========     =',
        '=                                   ====',
        '=    * +    *                       ====',
        '=                b                  ====',
        '========================================',
    ],
    [

        '=            _                        =',
        '=          ===========xxx====        =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=  ! ?                               =',
        '=========================ooo==========',
    ]
]

scene("game", ({levelIndex, score, time})=> {

    // différents elements d'un niveau
    const level = addLevel(LEVELS[levelIndex || 0], {
        tileWidth: 32,
        tileHeight: 32,
        tiles: {
            "=": () => [
                sprite("brickLight"),
                area(),
                body({isStatic: true})
            ],
/*            "-": () => [
                sprite("lift"),
                area(),
                body({isStatic: true}),
                "lift"
            ],*/
            ".": () => [
                sprite("button"),
                area(),
                scale(0.5),
                body({isStatic: true}),
                "button"
            ],
            "b": () => [
                sprite("box"),
                area(),
                body({mass: 2}),
                "box"
            ],
            "x": () => [
                sprite("lava"),
                area(),
                body({isStatic: true}),
                'dangerR'
            ],
            "o": () => [
                sprite("water"),
                area(),
                body({isStatic: true}),
                'dangerB'
            ],
            "!": () => [
                sprite("doorR"),
                area(),
                'doorR'
            ],
            "?": () => [
                sprite("doorB"),
                area(),
                'doorB'
            ],
            "a": () => [
                sprite("acid"),
                area(),
                body({isStatic: true}),
                'dangerB',
                'dangerR'
            ],
            "*": () => [
                sprite("diamondR"),
                area(),
                scale(0.75),
                'diamondR'
            ],
            "+": () => [
                sprite("diamondB"),
                area(),
                scale(0.75),
                'diamondB'
            ],
        }

    })

    // affichage du score
    const scoreLabel = add([
        text(score),
        pos(10, 40),
    ])

    // affiche temps qui passe
    const timer = add([
        text(0),
        pos(0, 100),
        fixed(),
        { time: 0 },
    ])

    /*  timer.onUpdate(() => {
        timer.time += dt()
        timer.text = timer.time.toFixed(1)
    })*/


    // RED PLAYER
    const playerRed = add([
        // list of components
        sprite("playerRed"),
        pos(5,0),
        area(),
        body(),
        "playerRed",
        "player"
    ]);
    // BLUE PLAYER
    const playerBlue = add([
        // list of components
        sprite("playerBlue"),
        pos(5,0),
        area(),
        body(),
        "playerBlue",
        "player"
    ]);


    // LIFT
    const lift = add([
        // list of components
        sprite("lift"),
        pos(1000,100),
        area(),
        body({mass: 200}),
        "lift"
    ]);


    onCollide("player", "button", (p,b,col)=>{
        if(col.isBottom()){
            onUpdate("lift", (lift) => {
                lift.move(0, -275, 20)
            })
        }

    })






    // déplacement ROUGE
    onKeyDown("right", ()=>{
        playerRed.move(SPEED,0)
    })
    onKeyDown("left", ()=>{
        playerRed.move(-SPEED,0)
    })
    onKeyPress("up", ()=>{
        if(playerRed.isGrounded()){
            playerRed.jump(JUMP_FORCE)
        }
    })
    // déplacement BLEU
    onKeyDown("d", ()=>{
        playerBlue.move(SPEED,0)
    })
    onKeyDown("q", ()=>{
        playerBlue.move(-SPEED,0)
    })
    onKeyPress("z", ()=>{
        if(playerBlue.isGrounded()){
            playerBlue.jump(JUMP_FORCE)
        }
    })


    // collision avec diamand rouge
    playerRed.onCollide("diamondR", (diamond)=>{
        destroy(diamond)
        score++
        scoreLabel.text = score
    })
    // collision avec diamand Bleu
    playerBlue.onCollide("diamondB", (diamond)=>{
        destroy(diamond)
        score++
        scoreLabel.text = score
    })


    // collision avec block eau
    onCollide("playerRed", "dangerB", (a, b, col) => {
        if(col.isBottom()){
            go("lose")
        }
    })
    // collision avec block lave
    onCollide("playerBlue", "dangerR", (a, b, col) => {
        if(col.isBottom()){
            go("lose")
        }
    })



    //NEXT LEVEL (répétition nulle)
    onCollide("playerRed", "doorR", (a,b,col)=>{
        onCollide("playerBlue", "doorB", ()=>{
            if(levelIndex < LEVELS.length - 1){
                go("game", {
                    levelIndex : levelIndex +1
                })
            }else {
                go("win")
            }
        })
    } )
    onCollide("playerBlue", "doorB", (a,b,col)=>{
        onCollide("playerRed", "doorR", ()=>{
            if(levelIndex < LEVELS.length - 1){
                go("game", {
                    levelIndex : levelIndex +1
                })
            }else {
                go("win")
            }
        })
    } )
})


scene("lose", ()=>{
    add([
        text("loser"),
        pos(center())
        // add something to retry level
    ])
})

scene("win", ()=>{
    add([
        text("you won"),
        pos(center())
    ])
})

// start game
go("game", {
    levelIndex: 0,
    score:0,
});