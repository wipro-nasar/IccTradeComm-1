import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { ApiService } from "../../service/api.service"
import { environment } from '../../../environments/environment';
@Injectable()
export class IccFinanceTodayServices {
  public baseUrl: string;
  constructor(private apiService: ApiService) { this.baseUrl = "http://localhost:8080/ "; }
  
  getFinanceTodayLists(){
    return this.apiService.tempGet(environment.serviePath_2+'api/v1/financing-details/financetodaylist');
  }
  getInvoiceRequestLists(id){
    // let stringifyObj = JSON.stringify( { invoiceDetails : { id : 1} })
    // 
    return this.apiService.tempGet(environment.serviePath_1+'invoice-request/invoice/'+id); 
  }

  getFinanceBiddingLists(id){
    return this.apiService.tempGet(environment.serviePath_2+'api/v1/bidding-details/biddingdetails/'+id);
  }

  getAcceptedFinanceDetails(id){
    return this.apiService.tempGet(environment.serviePath_2+'api/v1/financing-details/financingdetails/'+id);
  }  
  
}