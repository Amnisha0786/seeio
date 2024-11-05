export interface AddCode {
  documentType?: string;
  code1Name?: string;
  code1?: string;
  code2Name?: string;
  code2?: string;
  notes?: string;
  passwords: [
    {
      url: string,
      username: string,
      password: string,
      pin: string,
      associatedEmail: string,
      associatedPhone: string,
      notes: string
    }
  ]
}
