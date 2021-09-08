import * as PIXI from 'pixi.js';
import { Injectable } from '@angular/core';
import { Stitch } from '../interfaces';

const STITCHES: Stitch[] = [
  {
    index: 0,
    path: "M20,20 L80,80 M20,80 L80,20",
    name: "こま編み"
  },
  {
    index: 1,
    path: "M15,70 L50,20 L85,70 M38,45 L62,70 M62,45 L38,70",
    name: "こま編み2目1度"
  },
  {
    index: 2,
    path: "M15,25 L50,75 L85,25 M38,30 L62,55 M62,30 L38,55",
    name: "こま編み2目編み入れる"
  },
  {
    index: 3,
    path: "M15,25 L50,75 L85,25 M50,25 L50,75",
    name: "こま編み3目編み入れる"
  },
  {
    index: 4,
    path: "M30,25 L70,25 M50,25 L50,80",
    name: "中長編み"
  },
  {
    index: 5,
    path: "M30,25 L70,25 M50,25 L50,80 M40,50 L60,65",
    name: "長編み"
  },
  {
    index: 6,
    path: "M30,25 L70,25 M50,25 L50,80 M40,50 L60,65 M40,40 L60,55",
    name: "長々編み"
  },
  {
    index: 7,
    path: "M25,25 L45,25 M 55,25 L75,25 M35,25 L50,80 M65,25 L50,80 M30,40 L45,45 M55,40 L70,45",
    name: "長編み2目編み入れる"
  },
  {
    index: 8,
    path: "M20,25 L36,25 M43,25 L57,25 M64,25 L80,25 M27,25 L50,80 M50,25 L50,80 M71,25 L50,80 M25,40 L40,45 M43,40 L55,45 M60,40 L70,45",
    name: "長編み3目編み入れる"
  },
  {
    index: 9,
    path: "M20,20 L80,76 M20,76 L80,20 M20,80 L80,80",
    name: "こま編みのすじ編み"
  },
  {
    index: 10,
    path: "M30,25 L70,25 M50,25 L50,80 M50,25 C30,40 30,60 50,80 M50,25 C70,40 70,60 50,80",
    name: "中長編み3目の玉編み"
  },
  {
    index: 11,
    path: "M20,50 A20,10 0,1,0 80,50 M80,50 A20,10 0,1,0 20,50",
    name: "くさり編み"
  },
  {
    index: 12,
    path: "M50,20 A10,20 0,1,0 50,80 M50,80 A10,20 0,1,0 50,20",
    name: "立ち上がりくさり1目"
  },
  {
    index: 13,
    path: "M50,20 A8,16 0,1,0 50,50 M50,50 A8,16 0,1,0 50,20 M50,50 A8,16 0,1,0 50,80 M50,80 A8,16 0,1,0 50,50",
    name: "立ち上がりくさり2目"
  },
  {
    index: 14,
    path: "M50,05 A5,10 0,1,0 50,35 M50,35 A5,10 0,1,0 50,05 M50,35 A5,10 0,1,0 50,65 M50,65 A5,10 0,1,0 50,35 M50,65 A5,10 0,1,0 50,95 M50,95 A5,10 0,1,0 50,65",
    name: "立ち上がりくさり3目"
  },
];
@Injectable({
  providedIn: 'root'
})
export class StitchService {
  stitches = STITCHES;

  constructor() { }

  drawStitch(g: PIXI.Graphics, stitchType: number){
    switch(stitchType){
      case 0:
        g.moveTo(2,2).lineTo(18,18).moveTo(18,2).lineTo(2,18); break;
      case 1:
        g.moveTo(1,16).lineTo(10,2).lineTo(19,16);
        g.moveTo(6,10).lineTo(14,18);
        g.moveTo(6,18).lineTo(14,10);
        break;
      case 2:
        g.moveTo(1,2).lineTo(10,16).lineTo(19,2);
        g.moveTo(6,2).lineTo(14,10);
        g.moveTo(6,10).lineTo(14,2);
        break;
      case 3:
        g.moveTo(1,2).lineTo(10,16).lineTo(19,2);
        g.moveTo(10,2).lineTo(10,16);
        break;
      case 4:
        g.moveTo(5,3).lineTo(15,3);
        g.moveTo(10,3).lineTo(10,18);
        break;
      case 5:
        g.moveTo(5,3).lineTo(15,3);
        g.moveTo(10,3).lineTo(10,18);
        g.moveTo(7,11).lineTo(13,14);
        break;
      case 6:
        g.moveTo(5,3).lineTo(15,3);
        g.moveTo(10,3).lineTo(10,18);
        g.moveTo(7,11).lineTo(13,14);
        g.moveTo(7,8).lineTo(13,11);
        break;
      case 7:
        // Flat line
        g.moveTo(3,3).lineTo(9,3);
        g.moveTo(11,3).lineTo(17,3);
        // tilted line
        g.moveTo(6,3).lineTo(10,18);
        g.moveTo(14,3).lineTo(10,18);
        // middle parts
        g.moveTo(5,8).lineTo(9,9);
        g.moveTo(11,8).lineTo(15,9);
        break;
      case 8:
        // Flat line
        g.moveTo(2,3).lineTo(6,3);
        g.moveTo(8,3).lineTo(12,3);
        g.moveTo(14,3).lineTo(18,3);
        // tilted line
        g.moveTo(4,3).lineTo(10,18);
        g.moveTo(10,3).lineTo(10,18);
        g.moveTo(16,3).lineTo(10,18);
        // middle parts
        g.moveTo(3,8).lineTo(7,9);
        g.moveTo(8,8).lineTo(12,9);
        g.moveTo(12,8).lineTo(16,9);
        break;
      case 9:
        g.moveTo(2,2).lineTo(18,16).moveTo(18,2).lineTo(2,16);
        g.moveTo(3,17).lineTo(17,17);
        break;
      case 10:
        g.moveTo(4,3).lineTo(16,3);
        g.moveTo(10,3).lineTo(10,18);
        g.moveTo(10,4).quadraticCurveTo(2,9,10,18)
        g.moveTo(10,4).quadraticCurveTo(18,9,10,18)
        break;
      case 11:
        g.drawEllipse(10,10,7,4);
        break;
      case 12:
        g.drawEllipse(10,10,4,7);
        break;
      case 13:
        g.drawEllipse(10,5,3,5);
        g.drawEllipse(10,15,3,5);
        break;
      case 14:
        g.drawEllipse(10,3,2,3);
        g.drawEllipse(10,10,2,3);
        g.drawEllipse(10,17,2,3);
        break;
    }
    return g;
  }

}
