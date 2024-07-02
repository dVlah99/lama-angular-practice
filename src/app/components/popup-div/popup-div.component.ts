import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EditJsonPopupComponent } from '../edit-json-popup/edit-json-popup.component';
import { SeeJsonDataComponent } from '../see-json-data/see-json-data.component';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

interface LamaWebProduct {
  name: string;
  url: string;
}

@Component({
  selector: 'app-popup-div',
  standalone: true,
  imports: [
    EditJsonPopupComponent,
    SeeJsonDataComponent,
    DialogModule,
    CommonModule,
  ],
  templateUrl: './popup-div.component.html',
  styleUrl: './popup-div.component.scss',
})
export class PopupDivComponent implements OnChanges {
  constructor(private toastr: ToastrService) {}
  display = true;
  editMode!: boolean;
  data!: LamaWebProduct[];
  originalData!: LamaWebProduct[];
  @Input() key: string | undefined = '';
  @Input() input!: any[];
  @Output() output = new EventEmitter<any>();
  @Output() keyDelete = new EventEmitter<any>();
  @Output() editModeChange = new EventEmitter<boolean>();
  showCloseMessage = false;

  ngOnInit(): void {
    this.data = this.cloneData(this.input[this.key as unknown as number]);
    this.originalData = this.cloneData(
      this.input[this.key as unknown as number]
    );
  }

  ngOnChanges(): void {
    this.data = this.cloneData(this.input[this.key as unknown as number]);
  }

  ngOnDestroy() {
    this.output.emit(this.data);
  }

  async closeDialog() {
    this.output.emit({ data: this.data, editMode: this.editMode });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.editModeChange.emit(this.editMode);
  }

  //Sprema promjene kada se iz edit modea prijede nazad u view
  sendChanges(event: any) {
    this.toastr.success('Success', 'Client edited successfully');
    this.data = event;
    this.input[this.key as unknown as number] = this.data;
  }

  async sendRequest(method: string, data: any): Promise<void> {
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      await fetch(`${environment.apiUrl}/${this.key}`, {
        method: `${method}`,
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return;
    }

    throw new Error('Invalid method');
  }

  handleClientDelete(value: any) {
    this.editMode = false;
    this.keyDelete.emit(value);
    this.closeDialog();
  }

  showEditModeMessage(): void {
    if (this.editMode) {
      this.showCloseMessage = true;
      setTimeout(() => {
        this.showCloseMessage = false;
      }, 3000);
    }
  }

  private cloneData(data: any): any {
    return JSON.parse(JSON.stringify(data));
  }
}
