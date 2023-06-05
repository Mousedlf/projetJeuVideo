// initialize context
kaboom({
    scale:1,
    clearColor:[0,0,1,1],
});

const SPEED = 150

//load assets
loadSprite("playerRed", "sprites/playerRed.png");
loadSprite("playerBlue", "sprites/playerBlue.png");

loadSprite("brickLight", "sprites/brickLight.png");
loadSprite("doorR", "sprites/doorR.png");
loadSprite("doorB", "sprites/doorB.png");

loadSprite("lava", "sprites/lavablock.png");
loadSprite("water", "sprites/waterblock.png");
loadSprite("acid", "sprites/green.png");


//AUTRE
setGravity(1600)
setBackground(255,255,255,0)


//niveaux

const LEVELS = [
    [
        '======================================',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                    !   ?           =',
        '=                =============       =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=              =======               =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=         ====                       =',
        '=             ======aa=====          =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                          ====xxx====',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=================ooo==================',
    ],
    [
        '======================================',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=          ===========xxx====        =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=  ! ?                               =',
        '=========================ooo==========',
    ]
]


scene("game", ({levelIndex})=>{

    //
    const level = addLevel(LEVELS[levelIndex || 0],{
        tileWidth: 22,
        tileHeight: 22,
        tiles:{
            "=": () => [
                sprite("brickLight"),
                area(),
                body({ isStatic: true })
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

        }

    })

   // RED PLAYER
    const playerRed = add([
        // list of components
        sprite("playerRed"),
        pos(20,0),
        area(),
        body(),
    ]);

    onKeyDown("right", ()=>{
        playerRed.move(SPEED,0)
    })
    onKeyDown("left", ()=>{
        playerRed.move(-SPEED,0)
    })
    onKeyPress("up", ()=>{
        if(playerRed.isGrounded()){
            playerRed.jump()
        }
    })

    //ajout isTop() ?
    playerRed.onCollide("dangerB", ()=>{
        if(isTop()){
            go("lose")
        }
    })

    // BLUE PLAYER
    const playerBlue = add([
        // list of components
        sprite("playerBlue"),
        pos(20,0),
        area(),
        body(),
    ]);

    onKeyDown("d", ()=>{
        playerBlue.move(SPEED,0)
    })
    onKeyDown("q", ()=>{
        playerBlue.move(-SPEED,0)
    })
    onKeyPress("z", ()=>{
        if(playerBlue.isGrounded()){
            playerBlue.jump()
        }
    })

    //ajout isTop() ?
    playerBlue.onCollide("dangerR", ()=>{
        if(isTop(true)){
            go("lose")
        }
    })

    //NEXT LEVEL

 //   if les deux collide alors passage prochain niveau

    playerRed.onCollide("doorR", ()=>{
        if(levelIndex < LEVELS.length - 1){
            go("game", {
                levelIndex : levelIndex +1
            })
        }else {
            // Otherwise we have reached the end of game, go to "win" scene!
            go("win")
        }
    })

    playerBlue.onCollide("doorB", ()=>{
        if(levelIndex < LEVELS.length - 1){
            go("game", {
                levelIndex : levelIndex +1
            })
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
    levelIndex: 0
});