
var map={
	width:880,
	height:500,
	getMap:function () {
		return document.getElementById('game-area');
	}
};

var food={
	length:20,
	x:0,
    y:0,
    foodArr:[],
    getFood:function () {
        var div=document.createElement('div');
        div.className='food';
        this.foodArr.push(div);
        this.randomLocation();
        map.getMap().appendChild(div);

        // return document.getElementsByClassName('food')[0];
	},
	randomLocation:function () {
        var XIndex=map.width/this.length-1;
		var YIndex=map.height/this.length-1;
		this.x=parseInt(Math.random()*(XIndex+1))*this.length;
		this.y=parseInt(Math.random()*(YIndex+1))*this.length;
        // this.getFood().style.left=this.x+'px';
        // this.getFood().style.top=this.y+'px';
        this.foodArr[0].style.left=this.x+'px';
        this.foodArr[0].style.top=this.y+'px';


	}
	
};

/*
	蛇的移动规律： 把蛇尾抽出来 放到新的蛇头位置

	蛇的增长规律： 不断添加新的蛇头
*/

var snake={
	step:20,	//蛇身
	x:20,	//x，y坐标值
	y:20,
	direction:'right',	//移动方向
	bodyArr:[],	//所有关节以一个数组形式存储
    createSnakeBody:function(){
        var body=document.createElement('div');
        body.className='snake-body';
        return body;
    },
	createSnake:function () {
        for (var i=0;i<3;i++) {
            var body=this.createSnakeBody();
            
            body.style.left=this.x+'px';
            body.style.top=this.y+'px';
            this.x+=this.step;
            this.bodyArr.unshift(body);
            map.getMap().appendChild(body);
        }
        this.x-=this.step;
    },
	getNewHeadLocation:function () {
        
		switch(this.direction){
			case 'left':
				this.x-=this.step;
				break;
			case 'right':
				this.x+=this.step;
				break;
			case 'up':
				this.y-=this.step;
				break;
			case 'down':
				this.y+=this.step;
				break;
        }
	},
	insertNewHead:function () {
		var newHead=this.createSnakeBody();
		this.bodyArr.unshift(newHead); //向数组开头添加元素
		this.getNewHeadLocation();
		newHead.style.left=this.x+'px';
		newHead.style.top=this.y+'px';
		map.getMap().appendChild(newHead);
	},
	move:function () {      //移动实现方法：把最后一节插入到数组最前面

		var newHead=this.bodyArr.pop();    //移除最后一个元素
		this.bodyArr.unshift(newHead);
		this.getNewHeadLocation();
		newHead.style.left=this.x+'px';
		newHead.style.top=this.y+'px';
    }
};

var sum=0;
var score=document.getElementById('score');

function boom(){
    // if (snake.x<0||snake.x>map.width-snake.step||snake.y<0||snake.y>map.height-snake.step) {

    //     return false;
    // }
    var head=snake.bodyArr[0].style;
    if(snake.x<0){
        head.left='0px';
        return false;
    }
    if(snake.x>map.width-snake.step){
        head.left=map.width-snake.step+'px';
        return false;
    }
    if(snake.y<0){
        head.top='0px';
        return false;
    }
    if(snake.y>map.height-snake.step){
        head.top=map.height-snake.step+'px';
        return false;
    }
    for (let i=1;i<snake.bodyArr.length;i++) {
        // console.log(i,snake.bodyArr[i].style.left,snake.x,snake.bodyArr[i].style.top,snake.y);
        if (snake.bodyArr[0].style.left==snake.bodyArr[i].style.left && snake.bodyArr[0].style.top==snake.bodyArr[i].style.top) {
            console.log('boom')
            return false;
        }
    }

    return true;
}

function isEatFood(){
    if (snake.x==food.x && snake.y==food.y) {
        // console.log('get it');
        food.randomLocation();
        snake.insertNewHead();
        sum+=10;
        score.innerHTML=sum;
    }
}

function drawFailed(){
    var bg=document.createElement('div');
    bg.className='bg';
    bg.style.animationName='failed';

    map.getMap().appendChild(bg);
}

var speed=200;
// var speed=200;
// var speed=100;

function selectSpeed(){
    var level=$('#level option:selected') .val();
    if(level=='hard'){
        speed=100;
    }else if(level=='normal'){
        speed=200;
    }else if(level=='easy'){
        speed=500;
    }
}

var fg=document.getElementById('game-area');

document.onkeydown=function(e){
    fg.className='';

    food.getFood();
    // food.randomLocation();
    snake.createSnake();
    
    

	var timer=setInterval(function(){
		snake.move();
        isEatFood();
    
		if (!boom()) {
            clearInterval(timer);
            drawFailed();
		}
	},speed);

    var status=true;   //运动状态
	document.onkeydown=function(e){
        var keycode=e.keyCode;
        switch(keycode){
            case 32:
                if(status){
                    clearInterval(timer);
                }else{
                    timer=setInterval(function(){
                        snake.move();
                        isEatFood();
                    
                        if (!boom()) {
                            clearInterval(timer);
                        }
                    },speed);
                }
                status=!status;
                break;
            case 37:
                if (snake.direction!='right') {
                    snake.direction='left';
                }
                break;
            case 38:
                if (snake.direction!='down') {
                    snake.direction='up';
                }
                break;
            case 39:
                if (snake.direction!='left') {
                    snake.direction='right';
                }
                break;
            case 40:
                if (snake.direction!='up') {
                    snake.direction='down';
                }
                break;
        }
    }
    
}

