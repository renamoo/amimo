import { RectangleEditorService } from './../../component/rectangle-editor/rectangle-editor.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-page',
  templateUrl: './top-page.component.html',
  styleUrls: ['./top-page.component.scss']
})
export class TopPageComponent implements OnInit {
  selectedStitch:number = 0;
  hideStitchSelect = false;
  editMode:number = 0;

  constructor(private service: RectangleEditorService) { }

  ngOnInit(): void {
  }

  onStichSelect(stitch: number){
    this.selectedStitch = stitch;
    this.editMode = 0;
  }

  onModeSelect(mode: number){
    this.editMode = mode;
    this.hideStitchSelect = mode !== 0;
  }

  onSave(){
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = 'foo.jpeg';
    a.href =　this.service.getImage();
    a.click();
    a.remove();
  }

}
