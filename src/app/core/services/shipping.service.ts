import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor() { }

  private shippingMethodSource = new BehaviorSubject<string>('home_delivery'); // Valor por defecto
  currentShippingMethod = this.shippingMethodSource.asObservable();

  updateShippingMethod(method: string) {
    this.shippingMethodSource.next(method);
  }
}
