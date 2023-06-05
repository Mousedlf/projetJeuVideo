// initialize context
kaboom({
    scale:1,
    clearColor:[0,0,0,1],
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


//AUTRE
setGravity(1600)


//niveaux

const LEVELS = [
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
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                  !   ?             =',
        '=             ===========            =',
        '=                                    =',
        '=                                    =',
        '=  ========                ====xxx====',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '=                                    =',
        '========================oooo==========',
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
        '=                                    =',
        '========================oooo==========',
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
        }

    })

   // RED PLAYER
    const playerRed = add([
        // list of components
        sprite("playerRed"),
        pos(10, 0),
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
    playerRed.onCollide("dangerB", ()=>{
        go("lose")
    })

    // BLUE PLAYER
    const playerBlue = add([
        // list of components
        sprite("playerBlue"),
        pos(10, 0),
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

    playerBlue.onCollide("dangerR", ()=>{
        go("lose")
    })

    //NEXT LEVEL

    playerRed.onCollide("doorR", ()=>{
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

// start game
go("game", {
    levelIndex: 0
});