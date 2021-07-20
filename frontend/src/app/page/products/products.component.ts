import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/model/product';
import { ConfigService, ITableColumn } from 'src/app/service/config.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  tableColumns: ITableColumn[] = this.config.productColumns;
  list$: Observable<Product[]> = this.productService.getAll();

  constructor(
    private config: ConfigService,
    private productService: ProductService,
  ) { }

  // tslint:disable-next-line: no-empty
  ngOnInit(): void {
  }

  // tslint:disable-next-line: no-empty
  onClickEdit(product: Product): void {
  }

  // tslint:disable-next-line: no-empty
  onClickDelete(product: Product): void {
  }

}
