export const SWIFT_ABI = [
  "function SWIFT() view returns (address)",
  "function approvedBanks(address) view returns (bool)",
  "function approveBank(address bank, string name)",
  "function removeBank(address bank, string name)",
  "function transferToBank(address payable toBank, string paymentReference) payable",
  "event BankApproved(address indexed bank, string name)",
  "event BankRemoved(address indexed bank, string name)",
  "event BankTransfer(address indexed fromBank, address indexed toBank, uint256 amount, string paymentReference)"
];
