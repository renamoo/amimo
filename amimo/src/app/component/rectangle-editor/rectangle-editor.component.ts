import { MatrixService, Matrix33 } from './../../services/matrix.service';
import { RectangleEditorService } from './rectangle-editor.service';
import { StitchService } from './../../services/stitch.service';
import { Component, ElementRef, Input, NgZone, OnInit, Renderer2, SimpleChange, SimpleChanges, ViewChild } from '@angular/core'
import * as PIXI from 'pixi.js';
import { DisplayObject, Graphics, InteractionEvent, Container, Matrix } from 'pixi.js';

const getGridColor = () => PIXI.utils.string2hex("#AAAAAA");
const getWhite = () => PIXI.utils.string2hex("#FFFFFF");
const getBlack = () => PIXI.utils.string2hex("#000000");

const ROTATE_BOX_SIZE = 5;
const TRANSFORM_BOX_SIZE = 70;

interface StitchDetail{
  /** position of left-upper point, 0,0 in local */
  position: {
    x: number;
    y: number;
  },
  /** position of left-upper point, 0,0 in local without applying rotation */
  positionWithoutRotate: {
    x: number;
    y: number;
  },
}

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
  stitches: {[name:string]:StitchDetail} = {};
  transformTarget!: PIXI.Graphics;
  transformSupport!:PIXI.Graphics;
  rotateSupport!: PIXI.Graphics;
  dragging: {x:number, y:number} | null = null;
  rotating:{x:number, y:number} | null = null;

  constructor(private renderer: Renderer2,
    private service: StitchService,
    private zone:NgZone,
    private pixiService: RectangleEditorService,
    private matrixService: MatrixService
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
          const st = this.pixiService.drawStitch(this.stitchType, target);
          st.on('pointermove', event => this.onStitchPointerMove(event.currentTarget, event.data));
          st.on('pointerdown', event => this.onClickForTransform(event.currentTarget));
          this.pixiService.app.stage.addChild(st);
          this.addStitchMeta(st);
          break;
      }
    }
  }

  addStitchMeta(st:PIXI.Graphics){
    const po = {x: st.position.x, y: st.position.y};
    this.stitches[st.name] = {
      position: po,
      positionWithoutRotate: po,
    }
  }

  onStitchPointerMove(target: PIXI.Container, data:any){
    if(data.pressure>0){
      switch(this.mode){
        case 1:
          delete this.stitches[target.name];
          target.destroy();
          break;
      }
    }
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
  }

  onDragStart(event: PIXI.InteractionEvent) {
    this.dragging = {x: event.data.global.x, y: event.data.global.y};
  }

  onDragEnd() {
      this.dragging = null;
  }

  onDragMove(event:InteractionEvent) {
    if (this.dragging && event.data.pressure > 0) {
      const cur = event.data.global;
      const deltaX = cur.x - this.dragging.x;
      const deltaY = cur.y - this.dragging.y;
      if(deltaX != 0 || deltaY != 0){
        const unit = new Matrix33();
        unit.translate(deltaX, deltaY);
        this.transform(this.transformTarget, unit);
        this.transform(this.transformSupport, unit);
        this.transform(this.rotateSupport, unit);
        this.stitches[event.target.name].position = this.transformTarget.position;
        this.stitches[event.target.name].positionWithoutRotate = {x: this.transformTarget.position.x, y: this.transformTarget.position.y};
        this.dragging = {x: cur.x, y: cur.y};
      }
    }
  }

  /**
   *
   * @param target
   * @param unit
   * @param deltaX used to adjust x position when rotate around other than 0,0, left-uppper in local
   * @param deltaY used to adjust y position when rotate around other than 0,0, left-uppper in local
   */
  transform(target: PIXI.Graphics, unit: Matrix33, deltaX=0, deltaY=0){
    const {x, y} = this.matrixService.transform(target.x-deltaX, target.y-deltaY, unit);
    target.x = x+deltaX;
    target.y = y+deltaY;
  }

  onRotateStart(event: PIXI.InteractionEvent) {
    this.rotating = {x: event.data.global.x, y: event.data.global.y};
  }

  onRotateEnd() {
    this.rotating = null;
  }

  calcRadian(center: {x: number, y:number}, goal: {x: number, y:number}){
    // TODO: 45超えた角度の計算
    return 45 * ( Math.PI / 180 ) - Math.atan2(center.y-goal.y, goal.x - center.x);
  }

  /**
   *
   * @param target
   * @param unit
   * @param deltaX used to adjust x position when rotate around other than 0,0, left-uppper in local
   * @param deltaY used to adjust y position when rotate around other than 0,0, left-uppper in local
   */
  applyRotate(target: PIXI.Graphics, unit: Matrix33, deltaX=0, deltaY=0, preX:number, preY:number){
    const {x, y} = this.matrixService.transform(preX-deltaX, preY-deltaY, unit);
    target.x = x+deltaX;
    target.y = y+deltaY;
  }

  onRotate(event:InteractionEvent) {
    if (this.rotating && event.data.pressure>0) {
      const cur = event.data.global;
      // center position, used as a diff to calc rotated positions with pivot in center
      const deltaX = this.stitches[this.transformTarget.name].positionWithoutRotate.x + 10;
      const deltaY = this.stitches[this.transformTarget.name].positionWithoutRotate.y + 10;
      const radian = this.calcRadian({x:deltaX, y:deltaY}, cur);
      this.transformTarget.rotation = radian;
      this.rotateSupport.rotation = radian;
      this.transformSupport.rotation = radian;
      const unit = new Matrix33();
      unit.rotate(radian);
      const pure = this.stitches[this.transformTarget.name].positionWithoutRotate;
      this.applyRotate(this.transformTarget, unit, deltaX, deltaY, pure.x, pure.y);
      this.applyRotate(this.transformSupport, unit, deltaX, deltaY, pure.x-25, pure.y-25);
      this.applyRotate(this.rotateSupport, unit, deltaX, deltaY, pure.x-25, pure.y-25);
      this.stitches[this.transformTarget.name].position = this.transformTarget.position;
      this.rotating = {x: cur.x, y: cur.y};
    }
  }

  setPivotCenter(target: PIXI.Graphics){
    target.pivot.set(target.width / 2, target.height / 2);
    target.x = target.position.x + target.width / 2;
    target.y = target.position.y + target.height / 2;
  }
}
