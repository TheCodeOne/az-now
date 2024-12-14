import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {
  private http = inject(HttpClient);

  getProfessions() {
    return this.http.get<string[]>('api/berufeliste');
  }
}
