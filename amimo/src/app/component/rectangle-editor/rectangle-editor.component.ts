import { RectangleEditorService } from './rectangle-editor.service';
import { StitchService } from './../../services/stitch.service';
import { Component, ElementRef, Input, NgZone, OnInit, Renderer2, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import * as PIXI from 'pixi.js';
import { DisplayObject, Graphics, InteractionEvent, Container } from 'pixi.js';

const getGridColor = () => PIXI.utils.string2hex("#AAAAAA");
const getWhite = () => PIXI.utils.string2hex("#FFFFFF");
const getBlack = () => PIXI.utils.string2hex("#000000");

const ROTATE_BOX_SIZE = 5;
const TRANSFORM_BOX_SIZE = 70;

@Component({
  selector: 'app-rectangle-editor',
  templateUrl: './rectangle-editor.component.html',
  styleUrls: ['./rectangle-editor.component.scss']
})
export class RectangleEditorComponent implements OnInit {
  @Input() stitchType!: number;
  @Input() mode!: number;
  @ViewChild('container') container!: ElementRef;
  grids!: PIXI.Graphics[];
  stitches: PIXI.Graphics[] = [];
  transformTarget!: PIXI.Graphics;
  transformSupport!:PIXI.Graphics;
  rotateSupport!: PIXI.Graphics;
  dragging: {x:number, y:number} | null = null;
  rotating:{x:number, y:number} | null = null;

  constructor(private renderer: Renderer2,
    private service: StitchService,
    private zone:NgZone,
    private pixiService: RectangleEditorService
    ) { }

  ngOnInit(): void {
  }

  /** One-off Initialize */
  ngAfterViewInit(){
    this.zone.runOutsideAngular(() => {
      this.pixiService.createApp();
      this.renderer.appendChild(this.container.nativeElement, this.pixiService.app.view);
      this.pixiService.app.stage.addChild(...this.createGrid());
      this.pixiService.app.stage.addChild(...this.createBoldGrid());
      // this.pixiService.drawGrid(this.onGridPointerMove);
      this.pixiService.app.renderer.plugins.interaction.moveWhenInside = true;
    });
  }

  ngOnChanges(sc:SimpleChanges){
    if(!sc["mode"].firstChange && (sc["mode"].previousValue != sc["mode"].currentValue)){
      switch(this.mode){
        case 0:
        case 1:
          if(this.transformSupport){this.transformSupport.visible = false;}
          if(this.rotateSupport){this.rotateSupport.visible = false;}
      }
    }
  }

  createGrid(){
    let recs = [];
    for(let i = 0; i < 500 / 20; i++){
      for(let j = 0; j < 500 / 20; j++){
        let rec = this.createRectangleBase();
        rec.name = `grid_${i}_${j}`;
        rec.buttonMode = true;
        rec.x = 20 * i;
        rec.y = 20 * j;
        recs.push(rec);
      }
    }
    return recs;
  }

  createBoldGrid(){
    let recs = [];
    for(let i = 0; i < 500 / (20 * 5); i++){
      for(let j = 0; j < 500 / (20 * 5); j++){
        let rec = new Graphics();
        rec.name = `grid_bold_${i}_${j}`;
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
    rectangle.interactive = true;
    rectangle.hitArea = new PIXI.Rectangle(0,0,20,20);
    rectangle.on('pointermove', event => this.onGridPointerMove(event.currentTarget, event.data));
    return rectangle;
  }

  onGridPointerMove(target: PIXI.Container, data:any){
    if(data.pressure>0){
      switch(this.mode){
        case 0:
          let rectangle = this.getSymbol();
          rectangle.name = "stitch";
          rectangle.hitArea = new PIXI.Rectangle(0,0,20,20);
          rectangle.buttonMode = true;
          const global = target.getGlobalPosition();
          rectangle.x = global.x;
          rectangle.y = global.y;
          rectangle.on('pointermove', event => this.onStitchPointerMove(event.currentTarget, event.data));
          rectangle.on('pointerdown', event => this.onClickForTransform(event.currentTarget));
          this.pixiService.app.stage.addChild(rectangle);
          break;
      }
    }
  }

  onStitchPointerMove(target: PIXI.Container, data:any){
    if(data.pressure>0){
      switch(this.mode){
        case 1:
          target.destroy();
          break;
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

  getTransformSupport(){
    let rectangle = new Graphics();
    rectangle.lineStyle(1, getBlack(), 1);
    rectangle.drawRect(0, 0, TRANSFORM_BOX_SIZE, TRANSFORM_BOX_SIZE);
    rectangle.interactive = true;
    rectangle.hitArea = new PIXI.Rectangle(0,0,TRANSFORM_BOX_SIZE,TRANSFORM_BOX_SIZE);
    // TODO:　カーソルを十字にする
    rectangle.buttonMode = true;
    rectangle.on('pointerdown', event => this.onDragStart(event));
    rectangle.on('pointermove', event => this.onDragMove(event));
    rectangle.on('pointerup', event => this.onDragEnd());
    // TODO: 自由変形のサポート
    // for(let i = 0; i < 4; i++){
    //   let corner = new Graphics();
    //   corner.beginFill(getBlack());
    //   corner.drawRect(0, 0, 5, 5);
    //   corner.endFill();
    //   corner.interactive = true;
    //   corner.hitArea = new PIXI.Rectangle(0,0,5,5);
    //   corner.buttonMode = true;
    //   corner.on('pointerdown', event => console.log(event, 'a'));
    //   corner.on('pointermove', event => this.onDragMove(event));
    //   corner.on('pointerup', event => this.onDragEnd());
    //   // 計算をずらして4つの組み合わせにする
    //   corner.x = i % 2 == 0 ? -2.5 : 67.5;
    //   corner.y = i < 2 ? -2.5 : 67.5;
    //   rectangle.addChild(corner);
    // }
    return rectangle;
  }

  getRotateSupport(){
    const width = ROTATE_BOX_SIZE;
    let corner = new Graphics();
    corner.beginFill(getBlack());
    corner.drawRect(-(width/2), -(width/2), width, width);
    corner.drawRect(TRANSFORM_BOX_SIZE - (width/2), -(width/2), width, width);
    corner.drawRect(TRANSFORM_BOX_SIZE - (width/2), TRANSFORM_BOX_SIZE - (width/2), width, width);
    corner.drawRect(-(width/2), TRANSFORM_BOX_SIZE - (width/2), width, width);
    corner.endFill();
    corner.interactive = true;
    corner.buttonMode = true;
    corner.on('pointerdown', event => this.onRotateStart(event));
    corner.on('pointermove', event => this.onRotate(event));
    corner.on('pointerup', event => this.onRotateEnd());
    return corner;
  }

  private cleanUpSupport(){
    if(this.transformSupport){this.transformSupport.destroy();}
    if(this.rotateSupport){this.rotateSupport.destroy();}
  }

  private initSupport(){
    this.transformSupport = this.getTransformSupport();
    this.pixiService.app.stage.addChild(this.transformSupport);
    this.rotateSupport = this.getRotateSupport();
    this.pixiService.app.stage.addChild(this.rotateSupport);
  }

  onClickForTransform(target: PIXI.Graphics){
    this.cleanUpSupport();
    this.initSupport();
    this.transformSupport.x = target.x - 25;
    this.transformSupport.y = target.y - 25;
    this.transformTarget = target;
    this.rotateSupport.x = target.x - 25;
    this.rotateSupport.y = target.y - 25;
    if(this.transformTarget.pivot.x == 0){
      this.setPivotCenter(this.transformTarget);
    }
    this.setPivotCenter(this.rotateSupport);
    this.setPivotCenter(this.transformSupport);
    if(this.transformTarget.rotation > 0){
      this.transformSupport.rotation = this.transformTarget.rotation;
      this.rotateSupport.rotation = this.transformTarget.rotation;
    }
  }

  onDragStart(event: PIXI.InteractionEvent) {
    this.dragging = event.data.global;
  }

  onDragEnd() {
      this.dragging = null;
  }

  onDragMove(event:InteractionEvent) {
    console.log('onDrag')
    // 回転の向きと移動、回した時のroatteの座標
    if (this.dragging && event.data.pressure > 0) {
        const cur = event.data.global;
        this.transformSupport.x = cur.x;
        this.transformSupport.y = cur.y;
        this.rotateSupport.x = cur.x + ROTATE_BOX_SIZE/2;
        this.rotateSupport.y = cur.y + ROTATE_BOX_SIZE/2;
        const local = this.transformSupport.toLocal({x:0,y:0}, this.transformTarget.parent);
        this.transformTarget.x = -(local.x) + TRANSFORM_BOX_SIZE/2;
        this.transformTarget.y = -(local.y) + TRANSFORM_BOX_SIZE/2;
    }
  }

  onRotateStart(event: PIXI.InteractionEvent) {
    this.rotating = event.data.global;
  }

  onRotateEnd() {
    this.rotating = null;
  }

  onRotate(event:InteractionEvent) {
    console.log("onROtate")
    if (this.rotating && event.data.pressure>0) {
      const cur = event.data.global;
      const radian = Math.atan2(Math.abs(cur.y - this.rotateSupport.y), Math.abs(cur.x - this.rotateSupport.x));
      this.transformTarget.rotation = radian;
      this.rotateSupport.rotation = radian;
      this.transformSupport.rotation = radian;
    }
  }

  setPivotCenter(target: PIXI.Graphics){
    target.pivot.set(target.width / 2, target.height / 2);
    target.x = target.position.x + target.width / 2;
    target.y = target.position.y + target.height / 2;
  }
}
