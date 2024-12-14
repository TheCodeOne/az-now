import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import dayjs from 'dayjs';

interface QuoteData {
    status: string
    beitrag: {
        brutto: number
        netto: number
        verrechnung: number
    }
    pruefoption: boolean
    versicherungssumme: number
}

export interface QuotePayload {
  birthDate: string,
  profession: string,
  zahlbeitrag: number,
  isSmoker: boolean,
  versicherungsdauer: number,
  ressourceId: string
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private http = inject(HttpClient);

  getQuote({ birthDate, profession, zahlbeitrag, isSmoker, versicherungsdauer, ressourceId }: QuotePayload) {
    const payload = {
        ressourceId,
        "vertrag": {
            "produkt": "SBV_BASIS",
            "beginn": dayjs().add(1, 'month').format('YYYY-MM'), //"2025-01",
            "raucherstatus": isSmoker ? "1" : "0",
            "vertragslaufzeit": versicherungsdauer,
            "betrag": zahlbeitrag
        },
        "vp": {
            "geburtsdatum": birthDate, // "2005-01-01",
            "berufeingabe": profession // "Mathematiker(in)"
        },
        "extras": {
            "mandant": "SBAZ",
            "mandantTracking": "AZDE",
            "mandantPega": "SBAZ",
            "as": "sbv",
            "partner": "azde"
        }
    }
    return this.http.post<QuoteData>('api/quote', payload);
  }
}
