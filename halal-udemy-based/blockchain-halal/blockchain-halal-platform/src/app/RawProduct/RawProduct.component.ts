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
import { RawProductService } from './RawProduct.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-rawproduct',
  templateUrl: './RawProduct.component.html',
  styleUrls: ['./RawProduct.component.css'],
  providers: [RawProductService]
})
export class RawProductComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  ingredientsType = new FormControl('', Validators.required);
  productID = new FormControl('', Validators.required);
  Owner = new FormControl('', Validators.required);
  productDesc = new FormControl('', Validators.required);
  productStatus = new FormControl('', Validators.required);
  productionDate = new FormControl('', Validators.required);
  expirationDate = new FormControl('', Validators.required);
  CertificateLink = new FormControl('', Validators.required);

  constructor(public serviceRawProduct: RawProductService, fb: FormBuilder) {
    this.myForm = fb.group({
      ingredientsType: this.ingredientsType,
      productID: this.productID,
      Owner: this.Owner,
      productDesc: this.productDesc,
      productStatus: this.productStatus,
      productionDate: this.productionDate,
      expirationDate: this.expirationDate,
      CertificateLink: this.CertificateLink
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceRawProduct.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.prototype.blockchainhalal.RawProduct',
      'ingredientsType': this.ingredientsType.value,
      'productID': this.productID.value,
      'Owner': this.Owner.value,
      'productDesc': this.productDesc.value,
      'productStatus': this.productStatus.value,
      'productionDate': this.productionDate.value,
      'expirationDate': this.expirationDate.value,
      'CertificateLink': this.CertificateLink.value
    };

    this.myForm.setValue({
      'ingredientsType': null,
      'productID': null,
      'Owner': null,
      'productDesc': null,
      'productStatus': null,
      'productionDate': null,
      'expirationDate': null,
      'CertificateLink': null
    });

    return this.serviceRawProduct.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'ingredientsType': null,
        'productID': null,
        'Owner': null,
        'productDesc': null,
        'productStatus': null,
        'productionDate': null,
        'expirationDate': null,
        'CertificateLink': null
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


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.prototype.blockchainhalal.RawProduct',
      'ingredientsType': this.ingredientsType.value,
      'Owner': this.Owner.value,
      'productDesc': this.productDesc.value,
      'productStatus': this.productStatus.value,
      'productionDate': this.productionDate.value,
      'expirationDate': this.expirationDate.value,
      'CertificateLink': this.CertificateLink.value
    };

    return this.serviceRawProduct.updateAsset(form.get('productID').value, this.asset)
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


  deleteAsset(): Promise<any> {

    return this.serviceRawProduct.deleteAsset(this.currentId)
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

    return this.serviceRawProduct.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'ingredientsType': null,
        'productID': null,
        'Owner': null,
        'productDesc': null,
        'productStatus': null,
        'productionDate': null,
        'expirationDate': null,
        'CertificateLink': null
      };

      if (result.ingredientsType) {
        formObject.ingredientsType = result.ingredientsType;
      } else {
        formObject.ingredientsType = null;
      }

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

      if (result.CertificateLink) {
        formObject.CertificateLink = result.CertificateLink;
      } else {
        formObject.CertificateLink = null;
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
      'ingredientsType': null,
      'productID': null,
      'Owner': null,
      'productDesc': null,
      'productStatus': null,
      'productionDate': null,
      'expirationDate': null,
      'CertificateLink': null
      });
  }

}
