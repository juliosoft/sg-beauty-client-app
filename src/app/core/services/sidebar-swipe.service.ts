import { Injectable } from '@angular/core';

@Injectable()
export class SidebarSwipeService {
  width: number = 80;
  constructor() { }
  
  getWidth(){
    return this.width;
  }
  setWidth(widthNumner: number){
    this.width = widthNumner;

  }
}