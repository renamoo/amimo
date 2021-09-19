import { Injectable } from '@angular/core';

export class Matrix33{
  _11:number; _12: number; _13:number;
  _21:number; _22: number; _23:number;
  _31:number; _32: number; _33:number;

  constructor(){
    this._11=1; this._12=0; this._13=0;
    this._21=0; this._22=1; this._23=0;
    this._31=0; this._32=0; this._33=1;
  }

  scale(x:number, y:number){
    this._11 *= x;
    this._21 *= x;
    this._12 *= y;
    this._22 *= y;
  }

  /** angle = radian */
  rotate(angle:number){
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const new_11 = this._11 * cos + this._12 * sin;
    this._12 = this._11 * -sin + this._12 * cos;
    this._11 = new_11;
    const new_21 = this._21 * cos + this._22 * sin;
    this._22 = this._21 * -sin + this._22 * cos;
    this._21 = new_21;
  }

  translate(x:number, y:number) {
    this._13 = this._11 * x + this._12 * y;
    this._23 = this._21 * x + this._22 * y;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  constructor() { }

  transform(x:number, y:number, matrix: Matrix33){
    return {
      x: matrix._11 * x + matrix._12 * y + matrix._13 * 1,
      y: matrix._21 * x + matrix._22 * y + matrix._23 * 1
    };
  }

}
