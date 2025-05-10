export interface TransfersResponse {
    transferId: string;
    sourceAccount: string;
    destinationAccount: string;
    amount: number;
    fee: number;
    transferDate: Date | string;
    scheduleDate: Date | string;
}
