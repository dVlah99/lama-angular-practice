import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { environment } from '../../../environments/environment.production';

interface LamaWebProduct {
  name: string;
  url: string;
}

@Component({
  selector: 'app-edit-json-popup',
  standalone: true,
  imports: [DialogModule, CommonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './edit-json-popup.component.html',
  styleUrls: ['./edit-json-popup.component.scss'],
})
export class EditJsonPopupComponent {
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  originalData!: LamaWebProduct[];
  data!: LamaWebProduct[];
  dataValid: boolean = false;
  selectedItemIndex: number | null = null;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*';
  editForm!: FormGroup;
  @Input() inputData!: LamaWebProduct[];
  @Input() inputKey: string | undefined = '';
  @Output() dataChanges = new EventEmitter<any[]>();
  @Output() deleteClientOutput = new EventEmitter<{
    key: string;
    message: string;
  }>();

  ngOnInit(): void {
    this.initializeData();
    this.initializeForm();
  }

  initializeData(): void {
    this.originalData = this.cloneData(this.inputData);
    this.data = this.cloneData(this.inputData);
  }

  initializeForm(): void {
    this.editForm = this.formBuilder.group({
      items: this.formBuilder.array(
        this.inputData.map((item) => this.createItem(item))
      ),
    });
  }

  createItem(item: LamaWebProduct): FormGroup {
    return this.formBuilder.group({
      name: [
        item.name,
        Validators.compose([Validators.required, Validators.minLength(2)]),
      ],
      url: [
        item.url,
        Validators.compose([Validators.required, Validators.pattern(this.reg)]),
      ],
    });
  }

  async saveChanges() {
    if (this.editForm.valid) {
      if (!this.areProductsEqual(this.editForm.value.items, this.data)) {
        this.synchronizeProducts(this.originalData, this.data);
        this.dataChanges.emit(this.editForm.value.items);
        await this.sendRequest('POST', this.editForm.value.items);
      } else {
        this.toastr.warning('No changes detected', 'Warning');
      }
    } else {
      this.toastr.error('Please make sure to enter the correct data', 'Error');
    }
  }

  async addNewItem() {
    const items = this.editForm.get('items') as FormArray;
    items.push(this.createItem({ name: '', url: '' }));
    this.originalData.push({ name: '', url: '' });
  }

  async removeItem(index: number) {
    this.originalData.splice(index, 1);
    const items = this.editForm.get('items') as FormArray;
    items.removeAt(index);
  }

  async sendRequest(method: string, data: any): Promise<void> {
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      await fetch(`${environment.apiUrl}/${this.inputKey}`, {
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

  areProductsEqual(
    originalData: LamaWebProduct[],
    data: LamaWebProduct[]
  ): boolean {
    return JSON.stringify(originalData) === JSON.stringify(data);
  }

  synchronizeProducts(
    originalData: LamaWebProduct[],
    data: LamaWebProduct[]
  ): void {
    const minLength = Math.min(originalData.length, data.length);
    for (let i = 0; i < minLength; i++) {
      const originalProduct = originalData[i];
      const newDataProduct = data[i];

      if (
        originalProduct.name !== newDataProduct.name ||
        originalProduct.url !== newDataProduct.url
      ) {
        data[i] = { ...originalProduct };
      }
    }

    if (originalData.length > minLength) {
      const productsToAdd = originalData.slice(minLength);
      data.push(...productsToAdd);
    } else if (data.length > minLength) {
      data.splice(minLength);
    }
  }

  restoreData() {
    this.originalData = this.cloneData(this.data);
    this.initializeForm();
  }

  async deleteClient() {
    const confirmDestroy = confirm(
      'You will delete all client data. Do you wish to proceed?'
    );
    if (confirmDestroy) {
      await fetch(`${environment.apiUrl}/removeKey/${this.inputKey}`, {
        method: `DELETE`,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.deleteClientOutput.emit({
        key: this.inputKey as string,
        message: 'DeleteClient',
      });
      return;
    } else {
      return;
    }
  }

  get itemData() {
    return <FormArray>this.editForm.get('items');
  }

  private cloneData(data: any): any {
    return JSON.parse(JSON.stringify(data));
  }
}
