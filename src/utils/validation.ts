export function validateBidAmount(amount: number, minAmount: number = 2000): boolean {
  return amount >= minAmount && amount > 0;
}

export function validateTeamBalance(amount: number, balance: number): boolean {
  return amount <= balance;
}

export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}
