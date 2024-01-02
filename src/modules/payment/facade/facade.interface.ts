export interface PaymentFacadeInputDto {
  orderId: string;
  amount: number;
}

export interface PaymentFacadeOutputDto {
  transactionId: string;
  status: string;
  amount: number;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface PaymentFacadeInterface {
  process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto>;
}
