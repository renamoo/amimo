
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core'
import * as PIXI from 'pixi.js';
import { DisplayObject, Graphics, InteractionEvent, Container } from 'pixi.js';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent implements OnInit {
  @Input() stitchType: string = 'koma';
  @ViewChild('container') container!: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    let app = new PIXI.Application({width: 500, height: 500, backgroundAlpha:0});
    this.renderer.appendChild(this.container.nativeElement, app.view);
    let container = new PIXI.Container();
    container.addChild(...this.createGrid());
    app.stage.addChild(container);
    app.renderer.plugins.interaction.moveWhenInside = true;
  }

  createGrid(){
    let recs = [];
    for(let i = 0; i < 500 / 20; i++){
      for(let j = 0; j < 500 / 20; j++){
        let rec = this.createRectangleBase();
        rec.x = 20 * i;
        rec.y = 20 * j;
        recs.push(rec);
      }
    }
    return recs;
  }

  createRectangleBase(){
    let rectangle = new Graphics();
    rectangle.lineStyle(1, 0xFF3300, 1);
    rectangle.drawRect(0, 0, 20, 20);
    rectangle.endFill();
    rectangle.interactive = true;
    rectangle.hitArea = new PIXI.Rectangle(0,0,20,20);
    rectangle.on('pointermove', event => this.onSelect(event.currentTarget, event.data));
    return rectangle;
  }

  onSelect(target: PIXI.Container, data:any){
    if(data.pressure>0){
      let rectangle = this.getSymbol();
      target.addChild(rectangle);
    }
  }

  getSymbol(): PIXI.Graphics{
    let rectangle = new Graphics();
    rectangle.lineStyle(1,0xFF3300);
    rectangle.lineTo(20,20).moveTo(20,0).lineTo(0,20);
    rectangle.interactive = true;
    return rectangle;
  }

}
