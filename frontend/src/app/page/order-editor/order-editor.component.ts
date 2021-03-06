import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';
import { Location } from '@angular/common'
import { ConfigService } from 'src/app/service/config.service';
import { NgForm } from '@angular/forms';
import { CustomerService } from 'src/app/service/customer.service';
import { Customer } from 'src/app/model/customer';
import { TempService } from 'src/app/service/temp.service';
import { Product } from 'src/app/model/product';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-order-editor',
  templateUrl: './order-editor.component.html',
  styleUrls: ['./order-editor.component.scss']
})
export class OrderEditorComponent implements OnInit {

  order: Order = new Order();
  customers: Customer[] = [];
  currentCustomer: Customer = new Customer();
  tempProducts: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  totalSum: number = this.tempService.getTotalSumOfTempProducts();

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private location: Location,
    private config: ConfigService,
    public tempService: TempService
  ) { }

  async ngOnInit(): Promise<void> {
    const _id = this.activatedRoute.snapshot.params._id;
    if (_id !== '0') {
      const order = await this.orderService.getOne(_id).toPromise();
      this.order = order;
    } else {
      this.customers = await this.customerService.getAll().toPromise();
    }
    this.tempProducts = this.tempService.orderingProducts;
  }

  async setOrderToDatabase(order: Order, form: NgForm): Promise<void> {
    if (!order._id) {
      const _id = this.config.objectIDGenerator();
      try {
        await this.orderService.create({ ...form.value, _id }).toPromise();
        this.location.back();
        this.toastr.success('Sikeresen l??trehoztad a rendel??st!', 'Siker!', {
          timeOut: 3000,
        });
      } catch {
        this.toastr.error('Hiba a rendel??s l??trehoz??sakor!', 'Hiba!', {
          timeOut: 3000,
        })
      }
    } else {
      try {
        await this.orderService.update(order).toPromise();
        this.location.back();
        this.toastr.success('Sikeresen friss??tetted a rendel??st!', 'Siker!', {
          timeOut: 3000,
        });
      } catch {
        this.toastr.error('Hiba a rendel??s friss??t??sekor!', 'Hiba!', {
          timeOut: 3000,
        })
      }
    }
  };

  backToTheOrderList(): void {
    this.tempService.clearTemp();
    this.location.back();
  }

  async onChangeCustomer(customerId: string): Promise<void> {
    if (customerId !== 'V??laszd ki a v??s??rl??t') {
      this.currentCustomer = await this.customerService.getOne(customerId).toPromise();
      const emailField = document.querySelector('#email');
      if (emailField) {
        (emailField as HTMLInputElement).value = this.currentCustomer.email;
      }
    }
  }

  onClickRemoveProductFromOrder(product: Product): void {
    // const productIndex = this.order.products.findIndex(p => product._id === p._id);
    // this.order.products.splice(productIndex, 1);
  }

  onClickRemoveProductFromTemp(product: Product): void {
    this.tempService.delProductFromOrderList(product).subscribe(() => {});
  }

}
