'use strict';

class Boid {
  // コンストラクター
  constructor(parent, position, velocity, size, color){
    this.position = new Vector(position.x, position.y); // 位置
    this.velocity = new Vector(velocity.x, velocity.y); // 速度ベクトル
    this.acceleration = new Vector(0, 0); // 加速度ベクトル
    this.size = size; // 大きさ
    this.color = color; // 色
    this.parent = parent; // 親オブジェクトへの参照（BoidsCanvasのインスタンス）
  }

  // 鳥の描画
  draw() {
    // Canvasのコンテキストを取得
    let ctx = this.parent.ctx;

    // 円を描く
    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    // ここから描画処理
    
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1.0;
    ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ff0000';
    ctx.moveTo(0, 0);
    ctx.lineTo(this.velocity.x * this.size,
              this.velocity.y * this.size);
    ctx.stroke();
    

    // ここまで描画処理

    ctx.restore();
  }

  // 位置の更新
  update() {
    let v1 = this.alignment();  // 整列の加速度
    let v2 = this.separation(); // 分離の加速度
    let v3 = this.cohesion();   // 結束の加速度
    let v4 = this.separation_shit(); // フンに対する分離の加速度

    // 重み付けをする
    v1 = v1.mul(1.0);
    v2 = v2.mul(4.0);
    v3 = v3.mul(1.0);
    v4 = v4.mul(15.0);

    // 3つの加速度を足す
    this.acceleration = this.acceleration.add(v1);
    this.acceleration = this.acceleration.add(v2);
    this.acceleration = this.acceleration.add(v3);
    //白い鳥はフンを避けない。
    if(this.color!="#FFFFFF"){
      this.acceleration = this.acceleration.add(v4);
    }
    // 速度ベクトルに加速度ベクトルを足す
    this.velocity = this.velocity.add(this.acceleration);
    // 一定速度以上にならないように調整する
    this.velocity = this.velocity.limit(this.parent.speed);
    // 位置を更新する
    this.position = this.position.add(this.velocity);
    // 加速度ベクトルをリセットする
    this.acceleration = this.acceleration.mul(0);
    // 画面端の処理を行う
    this.borders();  
  }

  // 整列: 同じ方向に飛ぶ
  alignment() {
    // 変数の宣言と初期化をここに書く

    let dVector = new Vector(0,0);

    // すべての鳥について調査する
    for(let i = 0; i < this.parent.boids.length; i++) {
      // 距離を測る
      let d = this.position.dist(this.parent.boids[i].position);
      
      // ここに処理を書く
      if(d < this.parent.alignmentDist){
        dVector = dVector.add(this.parent.boids[i].velocity);
      }
    }
    // ここに処理を書く
    if(dVector.mag() > 0){
      dVector = dVector.normalise();
      dVector =dVector.mul(this.parent.speed);
      dVector = dVector.sub(this.velocity);
      dVector = dVector.limit(this.parent.maxForce)
      return dVector;
    }else{
      // もしまわりに1羽もいなかったら加速度としてゼロベクトルを返す
      return new Vector(0, 0);
    }
    
  }

  // 分離: ぶつからないように距離をとる
  separation() {
    // ここに処理を書く
    let a = new Vector(0,0);
    let count = 0;
 
    for(let i = 0; i < this.parent.boids.length; i++) {
      
        // 距離を測る
      let d = this.position.dist(this.parent.boids[i].position);
        
      if(d < this.parent.separationDist && d>0){
        let nigeru = new Vector(0,0);
        nigeru = this.position.sub(this.parent.boids[i].position);
        nigeru = nigeru.normalise();
        nigeru = nigeru.div(d);
        a = a.add(nigeru);
        count++;
      }
      
    }

    //1羽でもいたら
    if(count > 0){
      a = a.normalise();
      a = a.mul(this.parent.speed);
      a = a.sub(this.velocity);
      a = a.limit(this.parent.maxForce);

      return a;
    }
    else{ 
    // もしまわりに1羽もいなかったら加速度としてゼロベクトルを返します
    return new Vector(0, 0);
    }
   
  }

  //フンから分離する
  separation_shit(){
    let a = new Vector(0,0);
    let count = 0;

 
    for(let i = 0; i < this.parent.shits.length; i++) {
      // 距離を測る
      let d = this.position.dist(this.parent.shits[i].position);
        
      if(d < this.parent.separationDist_shit && d>0){
        let nigeru = new Vector(0,0);
        nigeru = this.position.sub(this.parent.shits[i].position);
        nigeru = nigeru.normalise();
        nigeru = nigeru.div(d);
        a = a.add(nigeru);
        count++;
      }
      
    }
    //1羽でもいたら
    if(count > 0){
      a = a.normalise();
      a = a.mul(this.parent.speed);
      a = a.sub(this.velocity);
      a = a.limit(this.parent.maxForce);
      return a;
    }
    else{ 
    // もしまわりにフンがなかったら加速度としてゼロベクトルを返します
    return new Vector(0, 0);
    }
  }

  // 結束: みんなが集まっているところに向かう
  cohesion() {
    // ここに処理を書く
    let a = new Vector(0,0);
    let count = 0;
    
    // すべての鳥について調査する
    for(let i = 0; i < this.parent.boids.length; i++) {
      // 距離を測る
      let d = this.position.dist(this.parent.boids[i].position);
      
      if(d < this.parent.cohesionDist && d>0){
        a = a.add(this.parent.boids[i].position);
        count++;
      }
    }
    
    if(count > 0){
      a = a.div(count);
      a = a.sub(this.position);
      a = a.normalise();
      a = a.mul(this.parent.speed);
      a = a.sub(this.velocity);
      a = a.limit(this.parent.maxForce);
      return a;

    }else{
      // もしまわりに1羽もいなかったら加速度としてゼロベクトルを返す
      return new Vector(0, 0);
    }
    
  }
    
  
  // 画面の端から出たら、反対側の端から登場させる
  borders() {
    if(this.position.x < 0) this.position.x = this.parent.canvas.width;
    if(this.position.y < 0) this.position.y = this.parent.canvas.height;
    if(this.position.x > this.parent.canvas.width) this.position.x = 0;
    if(this.position.y > this.parent.canvas.height) this.position.y = 0;  
  }
  
}
