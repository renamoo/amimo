import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

interface ModeDef {
  index: number;
  mode: string;
  path:string;
}

const EDIT_MODES: ModeDef[] = [
  {
    index: 0,
    mode: "編集モード",
    path: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
  },
  {
    index: 1,
    mode: "消しゴムモード",
    path: "M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12"
  },
  {
    index: 2,
    mode: "微調整モード",
    path: "M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12"
  }
];

@Component({
  selector: 'app-mode-selector',
  templateUrl: './mode-selector.component.html',
  styleUrls: ['./mode-selector.component.scss']
})
export class ModeSelectorComponent implements OnInit {
  @Input() selected!: number | null;
  @Output() selectedChange = new EventEmitter<number>();
  hovered!: number | null;
  modes = EDIT_MODES;

  constructor() { }

  ngOnInit(): void {
  }

  onMouseEnter(ind:number){
    this.hovered = ind;
  }

  onMouseLeave(ind:number){
    this.hovered = null;
  }

  onClick(ind:number){
    this.selected = ind;
    this.selectedChange.emit(ind);
  }

}
