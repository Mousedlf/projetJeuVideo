import kaboom from 'kaboom';

// initialize context
kaboom({
    scale:1,
    debug: true,
    background:[0,0,0,0],

});


setGravity(600)



const SPEED = 150
const JUMP_FORCE = 300


// SPRITES
loadSprite("playerRed", "sprites/cat.png");
loadSprite("playerBlue", "sprites/cat2.png");

loadSprite("brickLight", "sprites/floor.png");
//loadSprite("lift", "sprites/waterblock.png");
loadSprite("button", "sprites/brickLight.png");
loadSprite("superjump", "sprites/superjump.png");

loadSprite("box", "sprites/box.png");
loadSprite("doorR", "sprites/doorM.png");
loadSprite("doorB", "sprites/doorW.png");

loadSprite("diamondR", "sprites/diamondM.png");
loadSprite("diamondB", "sprites/diamondW.png");

loadSprite("lava", "sprites/puddleBrown.png");
loadSprite("water", "sprites/puddleWhite.png");
loadSprite("acid", "sprites/puddleRed.png");



// SOUNDS
//loadSound("score", "")


const LEVELS = [
    [
        '========================================',
        '= =                                    =',
        '= =                              !   ? =',
        '= =       ==============================',
        '= =  +                                 =',
        '= =====                                =',
        '= =====                                =',
        '= =====  b     ===xx======             =',
        '= =========aa===================       =',
        '= =                           ==       =',
        '= =               *                  + =',
        '=         =============                =',
        '=       ===           ==========ll======',
        '=                                =======',
        '=====                                ===',
        '=====  ===========                     =',
        '=====  ================oo=========     =',
        '=                                   ====',
        '=    * +    *                       ====',
        '=                b                  ====',
        '========================================',
    ],
    [
        '========================================',
        '=                                      =',
        '=                                      =',
        '========        =====                * =',
        '=================                 ======',
        '=                                      =',
        '= +              *+     =======        =',
        '=                                      =',
        '=         ==    ====                   =',
        '=                                      =',
        '===    ==aaaaaaaaaaaaaaaaaaaa======    =',
        '=                                      =',
        '= *                                    =',
        '=                                      =',
        '=                                      =',
        '=    ==xx====         *      +       ? =',
        '=    =                              ====',
        '======               ==     ==      ====',
        '======   !                        b ====',
        '===================ooooo===xxxxx========',
    ],
]



////////////////////// HOME
scene("empty", ()=>{
    add([
        text("to move brown cat use ARROWS"),
        color(0, 0, 0),
        pos(100,100),

    ])
    add([
        text("to move white cat use Z,Q,S,D"),
        color(0, 0, 0),
        pos(100,150),

    ])

    add([
        text("press Space or click to start"),
        color(0, 0, 0),
        pos(100,250),

    ])
    onKeyPress("space",() => {
        go("game", {
            levelIndex: 0,
            score: 0,
        })
    } )
    onClick(() => {
        go("game", {
            levelIndex: 0,
            score: 0,
        })
    })

})



////////////////////// GAME
scene("game", ({levelIndex, score , time})=> {

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
            ".": () => [
                sprite("button"),
                area(),
                scale(0.5),
                body({isStatic: true}),
                "button"
            ],
            "l": () => [
                sprite("superjump"),
                area(),
                body({isStatic: true}),
                "superjump"
            ],
            "b": () => [
                sprite("box"),
                area(),
                body({mass: 1}),
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


    // affiche temps qui passe
    const timer = add([
        text(0),
        pos(1350, 40),
        color(0, 0, 0),
        fixed(),
        { time: 0 },
    ])
    timer.onUpdate(() => {
        timer.time += dt()
        timer.text = timer.time.toFixed(1)
    })


    // affichage du score
    const scoreLabel = add([
        text(score),
        color(0, 0, 0),
        pos(1450, 100),
        scale(2)
    ])
    add([
        sprite("diamondR"),
        pos(1350, 100),
    ])
    add([
        sprite("diamondB"),
        pos(1400, 100),
    ])



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
    /*    const lift = add([
            // list of components
            sprite("lift"),
            pos(1000,100),
            area(),
            body({mass: 200}),
            "lift"
        ]);*/


    onCollide("player", "button", (p,b,col)=>{
        if(col.isBottom()){
            onUpdate("lift", (lift) => {
                lift.move(0, -275, 20)
            })
        }

    })


    playerRed.onGround((l) => {
        if (l.is("superjump")) {
            playerRed.jump(JUMP_FORCE * 1.5)
        }
    })
    playerBlue.onGround((l) => {
        if (l.is("superjump")) {
            playerBlue.jump(JUMP_FORCE * 1.5)
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
            go("lose", {score: score})
        }
    })
    // collision avec block lave
    onCollide("playerBlue", "dangerR", (a, b, col) => {
        if(col.isBottom()){
            go("lose", {score: score})
        }
    })



    //NEXT LEVEL (répétition nulle)
    onCollide("playerRed", "doorR", (a,b,col)=>{
        onCollide("playerBlue", "doorB", ()=>{
            if(levelIndex < LEVELS.length - 1){
                go("game", {
                    levelIndex : levelIndex +1,
                    score : scoreLabel.text
                })
            }else {
                go("win", {score: score})
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
                go("win", {score: score})
            }
        })
    } )

})


////////////////////// LOSE

scene("lose", ({score})=>{
    add([
        text(score),
        pos(center()),
        color(0, 0, 255),
        scale(2),
    ])

    onKeyPress("space",() => {
        go("game", {
            levelIndex: 0,
            score: 0,
        })
    } )
    onClick(() => {
        go("game", {
            levelIndex: 0,
            score: 0,
        })
    })

})


////////////////////// WIN
scene("win", ({score})=>{

    add([
        text(score),
        pos(center()),
        color(0, 0, 255),
        scale(2),
    ])

    onKeyPress("space",() => {
        go("game", {
            levelIndex: 0,
            score: 0,
        })
    } )
    onClick(() => {
        go("game", {
            levelIndex: 0,
            score: 0,
        })
    })
})



// start game
go("empty", {});