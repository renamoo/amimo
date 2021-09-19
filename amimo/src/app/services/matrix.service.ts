import { Injectable } from '@angular/core';

export interface Matrix33{
  _11:number, _12: number, _13:number,
  _21:number, _22: number, _23:number,
  _31:number, _32: number, _33:number,
}

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  constructor() { }

  getIdentity(): Matrix33{
    return {
      _11:1, _12: 0, _13:0,
      _21:0, _22: 1, _23:0,
      _31:0, _32: 0, _33:1,
    }
  }

  scale(x:number, y:number, matrix: Matrix33){
    matrix._11 *= x;
    matrix._21 *= x;
    matrix._12 *= y;
    matrix._22 *= y;
  }

  /** angle = radian */
  rotate(angle:number, matrix: Matrix33){
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const new_11 = matrix._11 * cos + matrix._12 * sin;
    matrix._12 = matrix._11 * -sin + matrix._12 * cos;
    matrix._11 = new_11;
    const new_21 = matrix._21 * cos + matrix._22 * sin;
    matrix._22 = matrix._21 * -sin + matrix._22 * cos;
    matrix._21 = new_21;
  }

  translate(x:number, y:number, matrix: Matrix33) {
    matrix._13 = matrix._11 * x + matrix._12 * y;
    matrix._23 = matrix._21 * x + matrix._22 * y;
  }

  transform(x:number, y:number, matrix: Matrix33){
    return {
      x: matrix._11 * x + matrix._12 * y + matrix._13 * 1,
      y: matrix._21 * x + matrix._22 * y + matrix._23 * 1
    };
  }

}
