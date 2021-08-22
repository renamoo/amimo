import { StitchService } from './../../services/stitch.service';
import { Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core'
import * as PIXI from 'pixi.js';
import { DisplayObject, Graphics, InteractionEvent, Container } from 'pixi.js';

const getGridColor = () => PIXI.utils.string2hex("#AAAAAA");
const getWhite = () => PIXI.utils.string2hex("#FFFFFF");
const getBlack = () => PIXI.utils.string2hex("#000000");

@Component({
  selector: 'app-rectangle-editor',
  templateUrl: './rectangle-editor.component.html',
  styleUrls: ['./rectangle-editor.component.scss']
})
export class RectangleEditorComponent implements OnInit {
  @Input() stitchType!: number;
  @Input() mode!: number;
  @ViewChild('container') container!: ElementRef;

  constructor(private renderer: Renderer2,
    private service: StitchService,
    private zone:NgZone
    ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.zone.runOutsideAngular(() => {
      let app = new PIXI.Application({width: 500, height: 500, backgroundColor:getWhite(), antialias:true});
      this.renderer.appendChild(this.container.nativeElement, app.view);
      let container = new PIXI.Container();
      container.addChild(...this.createGrid());
      container.addChild(...this.createBoldGrid());
      app.stage.addChild(container);
      app.renderer.plugins.interaction.moveWhenInside = true;
    });
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

  createBoldGrid(){
    let recs = [];
    for(let i = 0; i < 500 / 20 * 5; i++){
      for(let j = 0; j < 500 / 20 * 5; j++){
        let rec = new Graphics();
        rec.lineStyle(2, getGridColor(), 1);
        rec.drawRect(0, 0, 100, 100);
        rec.x = 100 * i;
        rec.y = 100 * j;
        recs.push(rec);
      }
    }
    return recs;
  }

  createRectangleBase(){
    let rectangle = new Graphics();
    rectangle.lineStyle(1, getGridColor(), 1);
    rectangle.drawRect(0, 0, 20, 20);
    rectangle.endFill();
    rectangle.interactive = true;
    rectangle.hitArea = new PIXI.Rectangle(0,0,20,20);
    rectangle.on('pointermove', event => this.onSelect(event.currentTarget, event.data));
    return rectangle;
  }

  onSelect(target: PIXI.Container, data:any){
    if(data.pressure>0){
      switch(this.mode){
        case 0:
          let rectangle = this.getSymbol();
          target.removeChildren();
          target.addChild(rectangle);
          break;
        case 1:
          target.removeChildren();break;
      }
    }
  }

  getSymbol(): PIXI.Graphics{
    let rectangle = new Graphics();
    rectangle.lineStyle(1,getBlack());
    this.service.drawStitch(rectangle, this.stitchType);
    rectangle.interactive = true;
    return rectangle;
  }
}
