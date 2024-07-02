import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

interface LamaWebProduct {
  name: string;
  url: string;
}

@Component({
  selector: 'app-see-json-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './see-json-data.component.html',
  styleUrl: './see-json-data.component.scss',
})
export class SeeJsonDataComponent {
  constructor() {}
  @Input() data!: LamaWebProduct[];
  sharedData!: LamaWebProduct;

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes['data'].currentValue;
  }
}
