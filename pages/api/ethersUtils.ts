import { ethers } from "ethers";

const BASE_RPC_URL = 'https://mainnet.base.org';

export const getProvider = (): ethers.JsonRpcProvider => {
  return new ethers.JsonRpcProvider(BASE_RPC_URL);
};

// USDC address on the Base network
export const USDC_ADDRESS = ethers.getAddress("0x833589fcd6edb6e08f4c7c32d4f71b54bda02913");

export const USDC_ABI = [
  // Add the necessary ABI details for the USDC contract
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
  // Add other functions as needed
];

