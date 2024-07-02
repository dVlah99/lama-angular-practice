import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
import { environment } from '../../../environments/environment.production';

@Component({
  selector: 'app-add-new-client',
  standalone: true,
  imports: [InputTextModule, CommonModule, FormsModule],
  templateUrl: './add-new-client.component.html',
  styleUrl: './add-new-client.component.scss',
})
export class AddNewClientComponent {
  constructor(private toastr: ToastrService) {}
  value: string = '';
  @Output() output = new EventEmitter<string>();
  @Output() closeNewClientWindow = new EventEmitter<boolean>();

  async addNewLamaClient(): Promise<void> {
    try {
      await this.sendRequest('PUT', this.value);
    } catch (error: any) {
      this.toastr.warning('Warning', `${error.message}`);
    }
  }

  async sendRequest(method: string, data: any): Promise<void> {
    const dataLength = data.length;
    if (dataLength <= 1) {
      this.toastr.warning(
        'Warning',
        'New entry must have at least 2 characters'
      );

      return;
    }
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      const response = await fetch(`${environment.apiUrl}/${data}`, {
        method: `${method}`,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const responseJson = await response.json();
        if (responseJson.hasOwnProperty('error')) {
          throw { message: `${responseJson.message}`, responseJson };
        }
      } else {
        this.output.emit(this.value);
      }
    }
  }

  close() {
    this.closeNewClientWindow.emit(false);
  }
}
