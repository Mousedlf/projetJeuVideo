// initialize context
kaboom({
    scale:1,
    debug: true,
});

const SPEED = 150
const JUMP_FORCE = 600

//load assets
loadSprite("playerRed", "sprites/playerRed.png");
loadSprite("playerBlue", "sprites/playerBlue.png");

loadSprite("brickLight", "sprites/brickLight.png");
loadSprite("box", "sprites/box.png");
loadSprite("doorR", "sprites/doorR.png");
loadSprite("doorB", "sprites/doorB.png");

loadSprite("diamondR", "sprites/diamondR.png");
loadSprite("diamondB", "sprites/diamondB.png");

loadSprite("lava", "sprites/lavablock.png");
loadSprite("water", "sprites/waterblock.png");
loadSprite("acid", "sprites/green.png");


//AUTRE
setGravity(1600)
setBackground(220,220,220,0)



//niveaux

const LEVELS = [
    [
        '======================================',
        '=                =                   =',
        '=                =                   =',
        '=                =                   =',
        '=                =   !   ?           =',
        '=                =============       =',
        '=  +                         ===     =',
        '=                 *             =    =',
        '======                               =',
        '=              =======               =',
        '=                               ======',
        '=                       ====   =     =',
        '=                                    =',
        '=         ====                       =',
        '=                            ===     =',
        '=             ======aa===            =',
        '=                                    =',
        '=                           ===xxx====',
        '=                                    =',
        '=                        ===         =',
        '=   +                         *      =',
        '=          b                         =',
        '=================ooo==================',
    ],
    [
        '======================================',
        '=                                    =',
        '======                               =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                   =',
        '=                                    =',
        '=          ===========xxx====        =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=  ! ?                               =',
        '=========================ooo==========',
    ]
]


scene("game", ({levelIndex, score})=>{

    // différents elements
    const level = addLevel(LEVELS[levelIndex || 0],{
        tileWidth: 32,
        tileHeight: 32,
        tiles:{
            "=": () => [
                sprite("brickLight"),
                area(),
                body({ isStatic: true })
            ],
            "b": () => [
                sprite("box"),
                area(),
                body({ mass: 2 }),
                "box"
            ],
            "x": () => [
                sprite("lava"),
                area(),
                body({ isStatic: true }),
                'dangerR'
            ],
            "o": () => [
                sprite("water"),
                area(),
                body({ isStatic: true }),
                'dangerB'
            ],
            "!": () => [
                sprite("doorR"),
                area(),
                body({ isStatic: true }),
                'doorR'
            ],
            "?": () => [
                sprite("doorB"),
                area(),
                body({ isStatic: true }),
                'doorB'
            ],
            "a": () => [
                sprite("acid"),
                area(),
                body({ isStatic: true }),
                'dangerB',
                'dangerR'
            ],
            "*": () => [
                sprite("diamondR"),
                area(),
                'diamondR'
            ],
            "+": () => [
                sprite("diamondB"),
                area(),
                'diamondB'
            ],
        }

    })

    // affichage du score
    const scoreLabel = add([
        text(score),
        pos(12),
    ])

   // RED PLAYER
    const playerRed = add([
        // list of components
        sprite("playerRed"),
        pos(2,0),
        area(),
        body(),
        "playerRed",
        "player"
    ]);

    // BLUE PLAYER
    const playerBlue = add([
        // list of components
        sprite("playerBlue"),
        pos(10,0),
        area(),
        body(),
        "playerBlue",
        "player"
    ]);

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

    // collision avec diamand rouge
    playerRed.onCollide("diamondR", (diamond)=>{
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

    // collision avec diamand Bleu
    playerBlue.onCollide("diamondB", (diamond)=>{
        destroy(diamond)
        score++
        scoreLabel.text = score
    })

    // collision avec block lave
    onCollide("playerBlue", "dangerR", (a, b, col) => {
        if(col.isBottom()){
            go("lose")
        }
    })

    //NEXT LEVEL
 // if les deux collide alors passage prochain niveau

    if((playerRed.onCollide("doorR") && playerBlue.onCollide("doorB")  )


    playerRed.onCollide("doorR", ()=>{
        if(levelIndex < LEVELS.length - 1){
            go("game", {
                levelIndex : levelIndex +1
            })
        }else {
            go("win")
        }
    })



})

scene("lose", ()=>{
    add([
        text("loser"),
        pos(center())
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
    score:0
});