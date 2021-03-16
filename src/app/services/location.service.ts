import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private http:HttpClient
  ) { }

  getAllLocations(){
    return this.http.get("https://mynestonline.com/collection/api/locations");
  }
}
