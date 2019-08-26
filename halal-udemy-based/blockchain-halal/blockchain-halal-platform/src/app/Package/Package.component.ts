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
import { PackageService } from './Package.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-package',
  templateUrl: './Package.component.html',
  styleUrls: ['./Package.component.css'],
  providers: [PackageService]
})
export class PackageComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  packageID = new FormControl('', Validators.required);
  packageName = new FormControl('', Validators.required);
  Owner = new FormControl('', Validators.required);
  productPackaged = new FormControl('', Validators.required);

  constructor(public servicePackage: PackageService, fb: FormBuilder) {
    this.myForm = fb.group({
      packageID: this.packageID,
      packageName: this.packageName,
      Owner: this.Owner,
      productPackaged: this.productPackaged
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePackage.getAll()
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
      $class: 'org.prototype.blockchainhalal.Package',
      'packageID': this.packageID.value,
      'packageName': this.packageName.value,
      'Owner': this.Owner.value,
      'productPackaged': this.productPackaged.value
    };

    this.myForm.setValue({
      'packageID': null,
      'packageName': null,
      'Owner': null,
      'productPackaged': null
    });

    return this.servicePackage.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'packageID': null,
        'packageName': null,
        'Owner': null,
        'productPackaged': null
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
      $class: 'org.prototype.blockchainhalal.Package',
      'packageName': this.packageName.value,
      'Owner': this.Owner.value,
      'productPackaged': this.productPackaged.value
    };

    return this.servicePackage.updateAsset(form.get('packageID').value, this.asset)
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

    return this.servicePackage.deleteAsset(this.currentId)
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

    return this.servicePackage.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'packageID': null,
        'packageName': null,
        'Owner': null,
        'productPackaged': null
      };

      if (result.packageID) {
        formObject.packageID = result.packageID;
      } else {
        formObject.packageID = null;
      }

      if (result.packageName) {
        formObject.packageName = result.packageName;
      } else {
        formObject.packageName = null;
      }

      if (result.Owner) {
        formObject.Owner = result.Owner;
      } else {
        formObject.Owner = null;
      }

      if (result.productPackaged) {
        formObject.productPackaged = result.productPackaged;
      } else {
        formObject.productPackaged = null;
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
      'packageID': null,
      'packageName': null,
      'Owner': null,
      'productPackaged': null
      });
  }

}
