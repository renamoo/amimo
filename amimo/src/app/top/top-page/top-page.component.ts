import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-page',
  templateUrl: './top-page.component.html',
  styleUrls: ['./top-page.component.scss']
})
export class TopPageComponent implements OnInit {
  selectedStitch:number = 0;
  editMode:number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onStichSelect(stitch: number){
    this.selectedStitch = stitch;
    this.editMode = 0;
  }

}
