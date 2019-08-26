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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { RawProductComponent } from './RawProduct/RawProduct.component';
import { ProcProductComponent } from './ProcProduct/ProcProduct.component';
import { PackageComponent } from './Package/Package.component';

import { RegulatorComponent } from './Regulator/Regulator.component';
import { SupplyCompanyComponent } from './SupplyCompany/SupplyCompany.component';
import { ManufacturingCompanyComponent } from './ManufacturingCompany/ManufacturingCompany.component';
import { DistributionCompanyComponent } from './DistributionCompany/DistributionCompany.component';
import { RetailCompanyComponent } from './RetailCompany/RetailCompany.component';

import { CreateRawProductComponent } from './CreateRawProduct/CreateRawProduct.component';
import { CreateProcProductComponent } from './CreateProcProduct/CreateProcProduct.component';
import { SendPackageComponent } from './SendPackage/SendPackage.component';
import { ReveivePackageComponent } from './ReveivePackage/ReveivePackage.component';
import { PackProductComponent } from './PackProduct/PackProduct.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'RawProduct', component: RawProductComponent },
  { path: 'ProcProduct', component: ProcProductComponent },
  { path: 'Package', component: PackageComponent },
  { path: 'Regulator', component: RegulatorComponent },
  { path: 'SupplyCompany', component: SupplyCompanyComponent },
  { path: 'ManufacturingCompany', component: ManufacturingCompanyComponent },
  { path: 'DistributionCompany', component: DistributionCompanyComponent },
  { path: 'RetailCompany', component: RetailCompanyComponent },
  { path: 'CreateRawProduct', component: CreateRawProductComponent },
  { path: 'CreateProcProduct', component: CreateProcProductComponent },
  { path: 'SendPackage', component: SendPackageComponent },
  { path: 'ReveivePackage', component: ReveivePackageComponent },
  { path: 'PackProduct', component: PackProductComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
