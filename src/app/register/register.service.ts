import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }
  getCountryData() {
    let url =  "../assets/country.json"
    return this.http.get<any>(url);
  }
}
