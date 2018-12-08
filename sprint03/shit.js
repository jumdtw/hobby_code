/* 
    白い鳥がフンを出すようにShitクラスを生成
    白い鳥以外はそのフンを避けるように新たにboid.js
    にベクトルを追加する

    フンの進む速度がかなり早いためたまに鳥にぶつかったりするが、
    正常な動作である。


*/

class Shit {
    // コンストラクター
    constructor(parent, position, velocity, size, color,boid_num){
      this.position = new Vector(position.x, position.y); // 位置
      this.velocity = new Vector(velocity.x, velocity.y); // 速度ベクトル
      this.acceleration = new Vector(0, 0); // 加速度ベクトル
      this.size = size; // 大きさ
      this.color = color; // 色
      this.boid_num = boid_num; //どの鳥のフンであるかを管理
      this.parent = parent; // 親オブジェクトへの参照（BoidsCanvasのインスタンス）
    }
  
    // フンの描画
    draw() {
      // Canvasのコンテキストを取得
      let ctx = this.parent.ctx;
  
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
  
      // ここから描画処理
      
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF';
      ctx.moveTo(0, 0);
      ctx.lineTo(this.velocity.x * this.size, this.velocity.y * this.size);
      ctx.stroke();
      
  
      // ここまで描画処理
  
      ctx.restore();
    }
  
    // 位置の更新
    update() {
     
      // 位置を更新する
      //this.position = this.position.add(this.velocity);
      this.position = new Vector(this.position.x,this.position.y+3.5);
      // 加速度ベクトルをリセットする
      this.acceleration = this.acceleration.mul(0);
      //再度鳥がフンを出すように画面端の処理を行う
      this.borders2boid();  
    }
  
    
    // 画面の端から出たら、再度鳥からフンを出すように設定
    borders2boid() {
      if(this.position.y > this.parent.canvas.height) this.position = this.parent.boids[this.boid_num].position;
    }
    
  }
  