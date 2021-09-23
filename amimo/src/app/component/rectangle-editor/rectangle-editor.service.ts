import { StitchService } from './../../services/stitch.service';
import { ComponentModule } from './../component.module';
import { RectangleEditorComponent } from './rectangle-editor.component';
import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';

const getWhite = () => PIXI.utils.string2hex("#FFFFFF");
const getGridColor = () => PIXI.utils.string2hex("#AAAAAA");
const getBlack = () => PIXI.utils.string2hex("#000000");

@Injectable({
  providedIn: ComponentModule
})
export class RectangleEditorService {
  app!: PIXI.Application;

  constructor(private stService: StitchService) { }

  createApp(){
    this.app = new PIXI.Application({width: 500, height: 500, backgroundColor:getWhite(), antialias:true});
    return this.app;
  }

  // drawGrid(onGridPointerMove: (target: PIXI.Container, data:any) => void){
  //   this.app.stage.addChild(...this.createGrid(onGridPointerMove));
  //   this.app.stage.addChild(...this.createBoldGrid());
  // }

  // private createRectangleBase(){
  //   let rectangle = new Graphics();
  //   rectangle.lineStyle(1, getGridColor(), 1);
  //   rectangle.drawRect(0, 0, 20, 20);
  //   rectangle.interactive = true;
  //   rectangle.hitArea = new PIXI.Rectangle(0,0,20,20);
  //   rectangle.on('pointermove', event => this.onGridClick(event.currentTarget, event.data));
  //   return rectangle;
  // }

  // private createGrid(){
  //   let recs = [];
  //   for(let i = 0; i < 500 / 20; i++){
  //     for(let j = 0; j < 500 / 20; j++){
  //       let rec = this.createRectangleBase();
  //       rec.name = `grid_${i}_${j}`;
  //       rec.buttonMode = true;
  //       rec.x = 20 * i;
  //       rec.y = 20 * j;
  //       recs.push(rec);
  //     }
  //   }
  //   return recs;
  // }

  // private createBoldGrid(){
  //   let recs = [];
  //   for(let i = 0; i < 500 / (20 * 5); i++){
  //     for(let j = 0; j < 500 / (20 * 5); j++){
  //       let rec = new Graphics();
  //       rec.lineStyle(2, getGridColor(), 1);
  //       rec.drawRect(0, 0, 100, 100);
  //       rec.x = 100 * i;
  //       rec.y = 100 * j;
  //       recs.push(rec);
  //     }
  //   }
  //   return recs;
  // }

  // private onGridClick(target: PIXI.Container, data:any){
  //   if(data.pressure>0){
  //     switch(this.mode){
  //       case 0:
  //         let rectangle = this.getSymbol();
  //         target.removeChildren();
  //         rectangle.name = "stitch";
  //         rectangle.hitArea = new PIXI.Rectangle(0,0,20,20);
  //         rectangle.buttonMode = true;
  //         target.addChild(rectangle);
  //         break;
  //       case 1:
  //         target.removeChildren();break;
  //     }
  //   }
  // }

  // private getSymbol(): PIXI.Graphics{
  //   let rectangle = new Graphics();
  //   rectangle.lineStyle(1,getBlack());
  //   this.service.drawStitch(rectangle, this.stitchType);
  //   rectangle.interactive = true;
  //   return rectangle;
  // }

  private forEachGrid(fn: (ch:PIXI.DisplayObject) => void){
    this.app.stage.children.forEach(ch => {
      if(ch.name && ch.name.startsWith("grid")){
        fn(ch);
      }
    });
  }

  getImage(){
    this.forEachGrid((ch:PIXI.DisplayObject) => {
      ch.visible = false;
    });
    // convert should be done in the same event as rendering
    // Ref: https://stackoverflow.com/questions/26783586/canvas-todataurl-returns-blank-image/26790802#26790802
    this.app.render();
    const image = this.app.renderer.plugins.extract.base64(null,'image/jpeg');
    this.forEachGrid((ch:PIXI.DisplayObject) => {
      ch.visible = true;
    });
    return image;
  }

  getSymbol(stitchType:number): PIXI.Graphics{
    let rectangle = new Graphics();
    rectangle.lineStyle(1,getBlack());
    this.stService.drawStitch(rectangle, stitchType);
    rectangle.interactive = true;
    return rectangle;
  }

  drawStitch(stitchType:number, target: PIXI.Container){
    let rectangle = this.getSymbol(stitchType);
    rectangle.name = `stitch_${PIXI.utils.uid()}`;
    rectangle.hitArea = new PIXI.Rectangle(0,0,20,20);
    rectangle.buttonMode = true;
    const global = target.getGlobalPosition();
    rectangle.x = global.x;
    rectangle.y = global.y;
    return rectangle
  }

}
