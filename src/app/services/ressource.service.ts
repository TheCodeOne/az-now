import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  private http = inject(HttpClient);

  getRessourceId() {
    return this.http.get<{ resourceId: string }>('api/resourceId');
  }
}
