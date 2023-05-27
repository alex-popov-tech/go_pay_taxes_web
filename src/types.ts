export type Income = {
  id: string;
  date: Date;
  currency: string;
  amount: number;
  rate: number;
  uah: number;
  tax: number;
};

export type IncomeDTO = Omit<Income, 'id'>;

// {"r030":840,"txt":"Долар США","rate":36.5686,"cc":"USD","exchangedate":"10.01.2023"}
export type Rate = {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
};
