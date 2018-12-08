'use strict';

class BoidsCanvas {
  // コンストラクター
  constructor(canvas){
    this.canvasDiv = canvas;
    this.canvasDiv.size = {
      'width': this.canvasDiv.offsetWidth,
      'height': this.canvasDiv.offsetHeight
    };

    this.separationDist = 50; // 分離の対象となる距離
    this.separationDist_shit = 50; // フンの分離の対象となる距離
    this.alignmentDist = 100; // 整列の対象となる距離
    this.cohesionDist = 200;  // 結束の対象となる距離
    this.maxForce = 0.04;     // 加速度の上限

    this.speed = 2;           // 速度の上限
    this.numBirds = 100;       // 鳥の数
    this.baseColor = '#660000'; // 背景色
    this.boidColors = ["#FFFFFF","#FE000","#00ED00","#0000DC"];  // 鳥の色

    this.boids = [];  // 鳥の配列
    this.shits = [];  // フンの配列
    // 初期化
    this.init();
  }

  // 鳥の配列を初期化
  initialiseBoids() {
    // 配列をクリア
    this.boids = [];
    this.shits = [];
    for(let i = 0; i < this.numBirds; i++) {
      
      // 位置
      let position = new Vector(Math.floor(Math.random() * (this.canvas.width + 1)),
                                Math.floor(Math.random() * (this.canvas.height + 1)));
      // 速度ベクトル
      let maxVelocity = 5;
      let minVelocity = -5;
      let velocity = new Vector(Math.floor(Math.random() * (maxVelocity - minVelocity + 1) + minVelocity),
                                Math.floor(Math.random() * (maxVelocity - minVelocity + 1) + minVelocity));
      // 大きさ
      let size = 8;
      // 色
      let colorIndex = Math.floor(Math.random() * (this.boidColors.length - 1 + 1));

      // 鳥の配列に1羽加える
      this.boids.push(new Boid(this, position, velocity, size, this.boidColors[colorIndex]));
      // 白い鳥が生成されたらフンを追加する
      if(this.boids[i].color === "#FFFFFF"){
        let position = new Vector(this.boids[i].position.x,this.boids[i].position.y);
        
        let velocity = new Vector(0,1);

        // 大きさ
        let size = 5;

        // 色
        let colorIndex = Math.floor(Math.random() * (this.boidColors.length - 1 + 1));

        // フンの配列に1つ加える
        this.shits.push(new Shit(this, position, velocity, size, this.boidColors[colorIndex],i));
      }
    }
  }

  // 初期化
  init() {
    this.bgDiv = document.createElement('div');
    this.canvasDiv.appendChild(this.bgDiv);
    this.setStyles(this.bgDiv, {
      'position': 'absolute',
      'top': 0,
      'left': 0,
      'bottom': 0,
      'right': 0,
      'z-index': 1,
      'background': this.baseColor
    });

    this.canvas = document.createElement('canvas');
    this.canvasDiv.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvasDiv.size.width;
    this.canvas.height = this.canvasDiv.size.height;
    this.setStyles(this.canvasDiv, { 'position': 'relative' });
    this.setStyles(this.canvas, {
      'z-index': '20',
      'position': 'relative'
    });

    // ウィンドウサイズが変更されたときの処理
    window.addEventListener('resize', function () {
      // divのサイズに変更がなければ何もしない
      if (this.canvasDiv.offsetWidth === this.canvasDiv.size.width && this.canvasDiv.offsetHeight === this.canvasDiv.size.height) {
        return false;
      }
  
      // canvasサイズの変更
      this.canvas.width = this.canvasDiv.size.width = this.canvasDiv.offsetWidth;
      this.canvas.height = this.canvasDiv.size.height = this.canvasDiv.offsetHeight;
  
      // 鳥の配列を初期化
      this.initialiseBoids();
    }.bind(this));

    // 鳥の配列を初期化
    this.initialiseBoids();

    requestAnimationFrame(this.update.bind(this));
  }

  // Canvasの描画
  update() {
    let count = this.shits.length - 1 
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;

    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].update();
      this.boids[i].draw();
      if(count >= 0){
        this.shits[count].update();
        this.shits[count].draw();
        count--;
      }
    }

    requestAnimationFrame(this.update.bind(this));
  }

  setStyles(div, styles) {
    for (let property in styles) {
      div.style[property] = styles[property];
    }
  }
}