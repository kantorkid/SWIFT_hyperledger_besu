export const CONTRACT_ADDRESS = "0xA26E1ae71146E109e06aAc7028b10CaA063bC998";

export const BANKS = {
  "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": {
    label: "Bank of America",
    short: "BOA",
    role: "Approved settlement bank",
  },
  "0x627306090abab3a6e1400e9345bc60c78a8bef57": {
    label: "Bank of China",
    short: "BOC",
    role: "Approved settlement bank",
  },
  "0xf17f52151ebef6c7334fad080c5704d77216b732": {
    label: "Hacker",
    short: "Unauthorized",
    role: "Rejected participant",
  },
};

export function labelFor(address) {
  if (!address) return "Unknown";
  const item = BANKS[address.toLowerCase()];
  return item ? item.label : `${address.slice(0, 6)}...${address.slice(-4)}`;
}
