import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddNewClientComponent } from '../add-new-client/add-new-client.component';
import { HeaderComponent } from '../header/header.component';
import { PopupDivComponent } from '../popup-div/popup-div.component';
import { environment } from '../../../environments/environment.production';

interface LamaWebProduct {
  name: string;
  url: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    PopupDivComponent,
    AddNewClientComponent,
  ],
  providers: [PopupDivComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  constructor(private toastr: ToastrService) {}
  onInitData: any;
  bubbleData: any;
  keyValues: string[] = [];
  selectedKey: string | undefined;
  editMode: boolean = false;
  newClientWindow: boolean = false;
  @Input() isOpened: boolean = false;

  async ngOnInit(): Promise<void> {
    this.onInitData = await this.getData();
    this.keyValues = Object.keys(this.onInitData);
  }

  async getData() {
    const response = await fetch(environment.apiUrl, {
      method: 'GET',
    });
    return await response.json();
  }

  showDialog(key: string) {
    this.newClientWindow = false;
    if (this.selectedKey) {
      this.selectedKey = key;
      this.isOpened = true;
    } else {
      this.selectedKey = key;
      this.bubbleData = this.onInitData;

      this.isOpened = true;
    }
  }

  opetAddNewClientWindow() {
    this.isOpened = this.editMode = false;
    this.newClientWindow = true;
  }

  handleEditModeChange(editMode: boolean) {
    this.editMode = editMode;
  }

  handleNewClientWindow(value: boolean) {
    this.newClientWindow = value;
  }

  handleDeleteKey(value: any) {
    const index = this.keyValues.indexOf(value.key);
    this.keyValues.splice(index, 1);
    delete this.onInitData[value.key];
  }

  handleNewKey(newKey: string) {
    this.toastr.success('Success', 'New client added');

    this.newClientWindow = !this.newClientWindow;
    this.keyValues.push(newKey);
    this.onInitData[`${newKey}`] = [];
  }

  receiveBooleanValue(value: any) {
    this.selectedKey = undefined;
    this.isOpened = false;
    this.editMode = value.edit;
  }

  isSelected(key: string): boolean {
    return key === this.selectedKey;
  }
}
