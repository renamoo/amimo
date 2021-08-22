import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleComponent } from './circle/circle.component';
import { RectangleEditorComponent } from './rectangle-editor/rectangle-editor.component';
import { StitchSelectorComponent } from './stitch-selector/stitch-selector.component';
import { ModeSelectorComponent } from './mode-selector/mode-selector.component';



@NgModule({
  declarations: [
    CircleComponent,
    RectangleEditorComponent,
    StitchSelectorComponent,
    ModeSelectorComponent
  ],
  exports:[
    CircleComponent,
    RectangleEditorComponent,
    StitchSelectorComponent,
    ModeSelectorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentModule { }
