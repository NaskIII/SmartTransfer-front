export default interface CreateTransferRequest {
    destinationAccount: string,
    amount: number,
    transferDate: Date | string
}