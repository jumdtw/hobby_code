'use strict';

class Vector{
  constructor(x, y) {
    if(x === 'undefined') x = 0;
    if(y === 'undefined') y = 0;
    this.x = x;
    this.y = y;
  }

  // 加算
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  // 減算
  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  // 乗算
  mul(n) {
    return new Vector(this.x * n, this.y * n);
  }

  // 除算
  div(n) {
    return new Vector(this.x / n, this.y / n);
  }

  // ベクトルの長さを返す
  mag() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }

  // 正規化した（長さを１にした）ベクトルを返す
  normalise() {
    let mag = this.mag();
    return new Vector(this.x / mag, this.y / mag);
  }

  // 2点間の距離を返す
  dist(v) {
    return Math.sqrt((this.x - v.x)*(this.x - v.x) + (this.y - v.y)*(this.y - v.y));  
  }

  // 長さを変えたベクトルを返す
  limit(limit) {
    let v;
    if(this.mag() > limit) {
      v = this.normalise().mul(limit);
    } else {
      v = this;
    }
    return v;
  }
}