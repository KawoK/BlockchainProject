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
import { CreateProcProductService } from './CreateProcProduct.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-createprocproduct',
  templateUrl: './CreateProcProduct.component.html',
  styleUrls: ['./CreateProcProduct.component.css'],
  providers: [CreateProcProductService]
})
export class CreateProcProductComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;

  productID = new FormControl('', Validators.required);
  Owner = new FormControl('', Validators.required);
  productDesc = new FormControl('', Validators.required);
  productStatus = new FormControl('', Validators.required);
  productionDate = new FormControl('', Validators.required);
  expirationDate = new FormControl('', Validators.required);
  composition = new FormControl('', Validators.required);
  CertificateLink = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceCreateProcProduct: CreateProcProductService, fb: FormBuilder) {
    this.myForm = fb.group({
      productID: this.productID,
      Owner: this.Owner,
      productDesc: this.productDesc,
      productStatus: this.productStatus,
      productionDate: this.productionDate,
      expirationDate: this.expirationDate,
      composition: this.composition,
      CertificateLink: this.CertificateLink,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCreateProcProduct.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the transaction field to update
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
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.prototype.blockchainhalal.CreateProcProduct',
      'productID': this.productID.value,
      'Owner': this.Owner.value,
      'productDesc': this.productDesc.value,
      'productStatus': this.productStatus.value,
      'productionDate': this.productionDate.value,
      'expirationDate': this.expirationDate.value,
      'composition': this.composition.value,
      'CertificateLink': this.CertificateLink.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'productID': null,
      'Owner': null,
      'productDesc': null,
      'productStatus': null,
      'productionDate': null,
      'expirationDate': null,
      'composition': null,
      'CertificateLink': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceCreateProcProduct.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'productID': null,
        'Owner': null,
        'productDesc': null,
        'productStatus': null,
        'productionDate': null,
        'expirationDate': null,
        'composition': null,
        'CertificateLink': null,
        'transactionId': null,
        'timestamp': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.prototype.blockchainhalal.CreateProcProduct',
      'productID': this.productID.value,
      'Owner': this.Owner.value,
      'productDesc': this.productDesc.value,
      'productStatus': this.productStatus.value,
      'productionDate': this.productionDate.value,
      'expirationDate': this.expirationDate.value,
      'composition': this.composition.value,
      'CertificateLink': this.CertificateLink.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceCreateProcProduct.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

  deleteTransaction(): Promise<any> {

    return this.serviceCreateProcProduct.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

    return this.serviceCreateProcProduct.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'productID': null,
        'Owner': null,
        'productDesc': null,
        'productStatus': null,
        'productionDate': null,
        'expirationDate': null,
        'composition': null,
        'CertificateLink': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.productID) {
        formObject.productID = result.productID;
      } else {
        formObject.productID = null;
      }

      if (result.Owner) {
        formObject.Owner = result.Owner;
      } else {
        formObject.Owner = null;
      }

      if (result.productDesc) {
        formObject.productDesc = result.productDesc;
      } else {
        formObject.productDesc = null;
      }

      if (result.productStatus) {
        formObject.productStatus = result.productStatus;
      } else {
        formObject.productStatus = null;
      }

      if (result.productionDate) {
        formObject.productionDate = result.productionDate;
      } else {
        formObject.productionDate = null;
      }

      if (result.expirationDate) {
        formObject.expirationDate = result.expirationDate;
      } else {
        formObject.expirationDate = null;
      }

      if (result.composition) {
        formObject.composition = result.composition;
      } else {
        formObject.composition = null;
      }

      if (result.CertificateLink) {
        formObject.CertificateLink = result.CertificateLink;
      } else {
        formObject.CertificateLink = null;
      }

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
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
      'productID': null,
      'Owner': null,
      'productDesc': null,
      'productStatus': null,
      'productionDate': null,
      'expirationDate': null,
      'composition': null,
      'CertificateLink': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
