import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractManagerService {
  private apiUrl = 'https://localhost:7185/api/Contract';

  constructor(private httpClient: HttpClient) {}

  uploadSignedContract(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post(`${this.apiUrl}/UploadSignedContract`, formData, httpOptionsWithAuth);
  }

  createContract(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post(`${this.apiUrl}/CreateContract`, formData, httpOptionsWithAuth);
  }

  approveContract(approveData: { Member_ID: string; Contract_ID: string }): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post(`${this.apiUrl}/ApproveContract`, approveData, httpOptionsWithAuth);
  }

  getSignedContract(memberId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetSignedContract/${memberId}`);
  }

  getTerminationRequests(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetTerminationRequests`);
  }

  approveRequestedTermination(data: { Contract_ID: number; Member_ID: number; CustomReason?: string; Requested_Termination_Reason_Type: number }): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post(`${this.apiUrl}/ApproveRequestedTermination`, data, httpOptionsWithAuth);
}

  getAllSignedContracts(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetAllSignedContracts`);
  }

  getMembersCountPerContractType(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetMembersCountPerContractType`);
  }

  downloadConsentFormForAdmin(memberId: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(`${this.apiUrl}/DownloadConsentForm/${memberId}`, { headers, responseType: 'blob' });
  }
  
  downloadSignedContractForAdmin(contractId: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(`${this.apiUrl}/DownloadSignedContractForAdmin/${contractId}`, { headers, responseType: 'blob' });
  }

  downloadMemberContract(): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(`${this.apiUrl}/DownloadMemberContract`, { headers, responseType: 'blob' });
  }

  terminateContract(terminationData: { contract_ID: number;member_ID:number; reason: string; termination_Reason_Type: number}): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post(`${this.apiUrl}/TerminateContract`, terminationData, { headers });
  }

  removeContractFile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token); 

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.httpClient.post(`${this.apiUrl}/RemoveContractFile`, formData, httpOptionsWithAuth);
  }

  changePassword(model: { CurrentPassword: string; NewPassword: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post(`${this.apiUrl}/ChangePassword`, model, { headers });
  }

  getAllContractHistory(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/GetAllContractHistory`);
}

// Assuming the response from the server is an object with filePath property
retrieveSignedContract(memberId: number): Observable<{ filePath: string }> {
  return this.httpClient.get<{ filePath: string }>(`${this.apiUrl}/RetrieveSignedContract?memberId=${memberId}`);
}

getUnapprovedContracts(): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.apiUrl}/GetUnapprovedContracts`);
}

discardUnapprovedContract(contract: any): Observable<any> {
  const token = localStorage.getItem('token');
  console.log('Retrieved token from localStorage:', token); 

  const httpOptionsWithAuth = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }),
    body: contract
  };
  return this.httpClient.delete(`${this.apiUrl}/DiscardUnapprovedContract`,  httpOptionsWithAuth);
}

getMembersWithUploadedContractsButNoContractRecord(): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.apiUrl}/GetMembersWithUploadedContractsButNoContractRecord`);
}

terminateContractRequest(contractId: number, memberId: number, terminationReasonType: number, customReason: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const requestData = {
    Contract_ID: contractId,
    Member_ID: memberId,
    Requested_Termination_Reason_Type: terminationReasonType,
    CustomReason: customReason || null
  };

  return this.httpClient.post(`${this.apiUrl}/TerminateContractRequest`, requestData, { headers });
}

getMemberAndContractIdsByIdNumber(idNumber: string): Observable<{ member_ID: number; contract_ID: number }> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.httpClient.get<{ member_ID: number; contract_ID: number }>(`${this.apiUrl}/GetMemberAndContractIdsByIdNumber/${idNumber}`, { headers });
}


}





