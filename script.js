const scoreSpan = document.querySelector('#scoreElement')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
// canvas s style
canvas.height = window.innerHeight
canvas.width = window.innerWidth
//<------------------------------->
class Player {
    constructor(){
        this.rotation = 0
        this.opacity = 1
        // movement 
        this.velocity = {x:0,y:0}
        //<------------------------>
        //import image of player ship
        const image = new Image()
        image.src = 'assets/spaceShip.png'
        image.onload = () => {
            this.img = image
            const scal = .11
            this.height = image.height * scal
            this.width = image.width  * scal
            this.position = {
                x:canvas.width / 2 - this.width / 2,
                y:canvas.height - this.height
            }
        }
        //<------------------------------------------>
    }
    // function to draw player in vancas
    draw(){
        // 1 2 3 4 5 6 are for ship retation while moving
        //1
        ctx.save()
        //2
        ctx.globalAlpha = this.opacity
        //3
        ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        //4
        ctx.rotate(this.rotation)
        //5
        ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height - 20 / 2)
        // drawing the shop
        ctx.drawImage(this.img, this.position.x, this.position.y ,this.width, this.height)
        //<--------------------------------------------------------------------------------->
        //6
        ctx.restore()
        //<---------------------------------------->
    }
    //<------------------------------------------------>
    // function to update position of player in canvas
    update(){
        if(this.img){
        this.draw()
        this.position.x += this.velocity.x
        }
    }
    //<------------------------------------------------>
}

class Arm {
    constructor({ position, velocity }){
    this.position = position
    this.velocity = velocity
    this.radius = 3
    }
    // function to draw each shot
    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
    }
    //<------------------------------------------------>
    // function to update position of each shot in canvas
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    //<------------------------------------------------>
}

class Explosion {
    constructor({ position, velocity, radius, color, fades }){
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.color = color
    this.opacity = 4
    this.fades = fades
    }
    // function to draw each shot
    draw(){
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    //<------------------------------------------------>
    // function to update position of each shot in canvas
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.fades){
            this.opacity -= 0.1
        }
    }
    //<------------------------------------------------>
}

class EnemyArm {
    constructor({ position, velocity }){
    this.position = position
    this.velocity = velocity
    
    this.width = 3
    this.height = 8
    }
    // function to draw each shot
    draw(){
        ctx.fillStyle = 'green'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    //<------------------------------------------------>
    // function to update position of each shot in canvas
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    //<------------------------------------------------>

    
}

class Enemy {
    constructor(position){

       
        this.velocity = {x:0,y:0}
        const image = new Image()
        image.src = 'assets/enemy.png'
        image.onload = () => {
            this.img = image
            const scal = .11
            this.height = 400 * scal
            this.width = 400  * scal
            this.position = {
                x:position.x,
                y:position.y
            }
         
   
        }
    }
    // function to draw each enemy
    draw(){
        ctx.drawImage(this.img, this.position.x, this.position.y ,this.width, this.height)   
    }
    //<------------------------------------------------>
    // function to update positions of grids in canvas
    update({velocity}){
        if(this.img){
        this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
        }
    }
    //<------------------------------------------------>

    shoot(enemyArm){
        enemyArm.push(new EnemyArm({
            position :{x:this.position.x + this.width / 2, y:this.position.y + this.height * 2 / 3},
            velocity :{x:0,y:5}

        }))
    }
}

class Grid {
    constructor(){
        this.position = {x:0,y:0}
        this.velocity = {x:3,y:0}
        this.enemys = []
        //variables to make multiple enemy in a group
        const rows = Math.floor(Math.random() * 5 + 2)
        const colums = Math.floor(Math.random() * 5 + 5)
        //<----------------------------------------------->
        //declaration of enemys group width
        this.width = colums * 40
        //<------------------------------>
         //the loop to make multiple enemy in a group
        for(let x = 0; x <colums; x++){
            for(let y = 0; y <rows; y++){
                this.enemys.push(new Enemy({x:x*40,y:y*40}))
            }
        }
    }
    // function to update positions of grids in canvas
    update(){
        // to move enemys
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        //<------------------------------------->
        // to drop enemys one time only
        this.velocity.y = 0
        //<------------------------------->
        // to keep enemys in vanvas
        if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x *= -1
            this.velocity.y = 40
        }
        //<------------------------------------------------------------------------->
    }
    //<------------------------------------------------------------------------------->

}
// declaration of element in canvas to draw "player" "enemys" "player s arm" "enemys arms"
const player = new Player()
const arm = []
const grids =[new Grid()]
const enemyArm = []
const explosions = []
//<------------------------------------------------------------------------>
const keys = {
    Left:{pressed:false},
    Right:{pressed:false},
    Space:{pressed:false}
}
// variable to add new group of enemys
var frame = 1
var RandomInterval = Math.floor((Math.random() * 500) + 500)
//<------------------------------>
// var of game scor
var score = 0
//<------------------------------>
// object of start and end the game
var game = {
    over: false,
    active: true
}
//<------------------------------>
//drawing game over meeage
function drawGameOver(score){
    const color = ctx.createLinearGradient(0,0,0,2)
    color.addColorStop("1","white")
    ctx.fillStyle = color
    ctx.font = '100px sans-serif'
    ctx.fillText('Game Over', canvas.width / 4 + 90, canvas.height / 2 - 40)
    
    ctx.fillStyle = color
    ctx.font = '60px sans-serif'
    ctx.fillText('you lost', canvas.width / 4 + 250, canvas.height / 2 + 10)

    color.addColorStop("1","red")
    ctx.fillStyle = color
    ctx.font = '60px sans-serif'
    ctx.fillText('your score is ' + score, canvas.width / 4 + 150, canvas.height / 2 + 60)
    var replay = document.createElement("button")
    replay.innerHTML="Replay"
    replay.classList.add("replay")
    replay.addEventListener('click',function(){location.reload()})
    // const body = document.getElementsByTagName('body')
    document.body.insertBefore(replay, canvas);
    console.log("salina")
}
//<------------------------------>
// drawing background animation
for(let i = 0 ;i < 100; i++){    
    explosions.push(new Explosion({position:{x:Math.random() * canvas.width, y:Math.random() * canvas.height},
                           velocity:{x:0, y:0.6},
                           radius:1,
                           color: 'white'
                        }))
}
//<------------------------------------------------------------------------------------------------------------------->
//function creating explosions effect
function creatExplosions({object,color,fades}){
    for(let i = 0 ;i < 15; i++){    
        explosions.push(new Explosion({position:{x:object.position.x + object.width / 2, y:object.position.y + object.height / 2},
                               velocity:{x:(Math.random() - 0.5) * 2, y:(Math.random() - 0.5) *2},
                               radius:1,
                               color: color || '#BAA0DE',
                               fades: true
                            }))
    }
}
//function repeating here self to update game
function animation(){
    // condition that stop game of moving after lose and showing lose message
    if(!game.active){
        drawGameOver(score)
        return
    }
    //<-------------------------------------------->
    // function that repeat a function for each frame
    requestAnimationFrame(animation)
    //<--------------------------------------------->
    // drawing canvas s background color
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,canvas.width ,canvas.height)
    //<---------------------------------------------->
    // updating player in canvas
    player.update()
    //<------------------------->
    // deleting or updating the explosions effects from cancas
    explosions.forEach((explosion, index)=>{
        if( explosion.position.y - explosion.radius >= canvas.height){
            explosion.position.x = Math.random() * canvas.width
            explosion.position.y = - explosion.radius 
        }
        if(explosion.opacity <= 0){
            setTimeout(()=>{
                explosions.splice(index,1)
            }, 0)
        }else{
            explosion.update()
        }
    })
    //<----------------------------------------------->
    // updating position of enemys shots or delet them from canvas
    enemyArm.forEach( (shot,index) =>{
        if(shot.position.y + shot.height >= canvas.height){
            setTimeout(() => {
                enemyArm.splice(index, 1), 0
            })
        }else{
            shot.update()
        }
        if(shot.position.y + shot.height >= player.position.y && shot.position.x + shot.width >= player.position.x && shot.position.x <= player.position.x + player.width){
            //creat enemys explosions
            creatExplosions({object:player,color:'white',fades:true})
            setTimeout(() => {
                enemyArm.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0)
            setTimeout(() => {
                game.active = false
            }, 2000)
        }
    })
    //<---------------------------------------------------------------->
    // updating position of player shots or delet them from canvas
    arm.forEach((shot , index) =>{
        if(shot.position.y + shot.radius <= 0){
            setTimeout(() => {
                arm.splice(index, 1),0
            })
        }else{
            shot.update()
        }
    })
    //<---------------------------------------------------------------->
    // updating grid and enemys position or destroying them from canvas
    grids.forEach((grid,gridIndex)=>{
        grid.update()
        // adding enemys shots
        if(frame % 100 === 0 && grid.enemys.length > 0){
            grid.enemys[Math.floor(Math.random() * grid.enemys.length)].shoot(enemyArm)
        }
        grid.enemys.forEach((enemy, i)=>{
            //updating enemy in canvas
            enemy.update({velocity: grid.velocity})
            //removing enemy and shot when touch "kill"
            arm.forEach((shot, index)=>{
                if( shot.position.y - shot.radius <= enemy.position.y + enemy.height &&
                    shot.position.y + shot.radius >= enemy.position.y && 
                    shot.position.x + shot.radius >= enemy.position.x &&
                    shot.position.x - shot.radius <= enemy.position.x + enemy.width){
                    // tot remove error enemy detected 
                    setTimeout(()=>{
                        const enemyFound = grid.enemys.find((enemy2)=> enemy2 === enemy)
                        const shotFound = arm.find((shot2)=> shot2 === shot)
                        if(enemyFound && shotFound){
                            // add scor for each kill
                            score += 1
                            //creat enemys explosions
                            creatExplosions({object:enemy,color:'#BAA0DE',fades:true})
                            //removing enemy and shot
                            grid.enemys.splice(i, 1)
                            arm.splice(index, 1)
                            // specify width of grid after each kill
                            if(grid.enemys.length > 0){
                                const firstEnemy = grid.enemys[0]
                                const lastEnemy = grid.enemys[grid.enemys.length - 1]
                                grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width
                                grid.position.x = firstEnemy.position.x
                            }
                            //deleting grids that are empty of enemys
                            else{
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
            //<-------------------------------------------------------------------------------->
        })
    })
    //<----------------------------------------------------------------------------------------------------------->
    // for moving player with keyboards keys
    if(keys.Left.pressed && player.position.x > 0){
        player.velocity.x = -7
        player.rotation = - .2
    }else if(keys.Right.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 7
        player.rotation = .2
    }
    else{
        player.velocity.x = 0
        player.rotation = 0
    }
    //<------------------------------------------------------------------------------------>
    // add new group of enemys each 1000 frame
    if(frame % RandomInterval === 0){
        grids.push(new Grid())
        frame = 0
    }
    frame++
    scoreSpan.innerHTML = score

}
animation()
//<-------------------------------------------------------------------------------------------->
//keyboard clicks events
addEventListener('keydown', ({key}) =>{
    // condition to stop player from moving and shooting if he lost
    if(game.over) return
    //<---------------------->
    switch(key){
        case 'ArrowLeft':
        keys.Left.pressed = true
        break
        case 'ArrowRight':
        keys.Right.pressed = true
        break
        case ' ':
        // keys.Space.pressed = true
        if(frame % 1 == 0){
        arm.push(
            new Arm({
                position : {x : player.position.x + player.width / 2, y : player.position.y},
                velocity : {x : 0, y : -5}
            })
        )}
        break

    }
    
})
addEventListener('keyup', ({key}) =>{
    switch(key){
        case 'ArrowLeft':
        keys.Left.pressed = false
        break
        case 'ArrowRight':
        keys.Right.pressed = false
        break
        case ' ':
        keys.Space.pressed = false
        break

    }
    
})
//<------------------------------------------------------------------------------------------------------>