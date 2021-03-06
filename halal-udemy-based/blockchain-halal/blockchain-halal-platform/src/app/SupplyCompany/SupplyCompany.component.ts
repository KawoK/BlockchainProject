/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SupplyCompanyService } from './SupplyCompany.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-supplycompany',
  templateUrl: './SupplyCompany.component.html',
  styleUrls: ['./SupplyCompany.component.css'],
  providers: [SupplyCompanyService]
})
export class SupplyCompanyComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  Type = new FormControl('', Validators.required);
  CompanyId = new FormControl('', Validators.required);
  CompanyName = new FormControl('', Validators.required);
  CompanyDesc = new FormControl('', Validators.required);
  CompanyAdress = new FormControl('', Validators.required);
  CompanyContact = new FormControl('', Validators.required);


  constructor(public serviceSupplyCompany: SupplyCompanyService, fb: FormBuilder) {
    this.myForm = fb.group({
      Type: this.Type,
      CompanyId: this.CompanyId,
      CompanyName: this.CompanyName,
      CompanyDesc: this.CompanyDesc,
      CompanyAdress: this.CompanyAdress,
      CompanyContact: this.CompanyContact
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceSupplyCompany.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.prototype.blockchainhalal.SupplyCompany',
      'Type': this.Type.value,
      'CompanyId': this.CompanyId.value,
      'CompanyName': this.CompanyName.value,
      'CompanyDesc': this.CompanyDesc.value,
      'CompanyAdress': this.CompanyAdress.value,
      'CompanyContact': this.CompanyContact.value
    };

    this.myForm.setValue({
      'Type': null,
      'CompanyId': null,
      'CompanyName': null,
      'CompanyDesc': null,
      'CompanyAdress': null,
      'CompanyContact': null
    });

    return this.serviceSupplyCompany.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'Type': null,
        'CompanyId': null,
        'CompanyName': null,
        'CompanyDesc': null,
        'CompanyAdress': null,
        'CompanyContact': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.prototype.blockchainhalal.SupplyCompany',
      'Type': this.Type.value,
      'CompanyName': this.CompanyName.value,
      'CompanyDesc': this.CompanyDesc.value,
      'CompanyAdress': this.CompanyAdress.value,
      'CompanyContact': this.CompanyContact.value
    };

    return this.serviceSupplyCompany.updateParticipant(form.get('CompanyId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceSupplyCompany.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceSupplyCompany.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'Type': null,
        'CompanyId': null,
        'CompanyName': null,
        'CompanyDesc': null,
        'CompanyAdress': null,
        'CompanyContact': null
      };

      if (result.Type) {
        formObject.Type = result.Type;
      } else {
        formObject.Type = null;
      }

      if (result.CompanyId) {
        formObject.CompanyId = result.CompanyId;
      } else {
        formObject.CompanyId = null;
      }

      if (result.CompanyName) {
        formObject.CompanyName = result.CompanyName;
      } else {
        formObject.CompanyName = null;
      }

      if (result.CompanyDesc) {
        formObject.CompanyDesc = result.CompanyDesc;
      } else {
        formObject.CompanyDesc = null;
      }

      if (result.CompanyAdress) {
        formObject.CompanyAdress = result.CompanyAdress;
      } else {
        formObject.CompanyAdress = null;
      }

      if (result.CompanyContact) {
        formObject.CompanyContact = result.CompanyContact;
      } else {
        formObject.CompanyContact = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'Type': null,
      'CompanyId': null,
      'CompanyName': null,
      'CompanyDesc': null,
      'CompanyAdress': null,
      'CompanyContact': null
    });
  }
}
