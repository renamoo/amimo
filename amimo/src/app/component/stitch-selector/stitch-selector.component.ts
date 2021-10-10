import { StitchService } from './../../services/stitch.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Stitch } from './../../interfaces';

@Component({
  selector: 'app-stitch-selector',
  templateUrl: './stitch-selector.component.html',
  styleUrls: ['./stitch-selector.component.scss']
})
export class StitchSelectorComponent implements OnInit {
  @Input() selected!: number | null;
  @Input() disabled: boolean = false;
  @Output() selectedChange = new EventEmitter<number>();
  hovered!: number | null;
  stitch_btns!:Stitch[];

  constructor(private service:StitchService) { }

  ngOnInit(): void {
    this.stitch_btns = this.service.stitches;
  }

  onMouseEnter(ind:number){
    this.hovered = ind;
  }

  onMouseLeave(ind:number){
    this.hovered = null;
  }

  onClick(ind:number){
    if(this.disabled){return;}
    this.selected = ind;
    this.selectedChange.emit(ind);
  }

}
