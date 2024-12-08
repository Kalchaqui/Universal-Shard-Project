import { ethers } from "ethers";

export const getContract = (contractAddress: string, abi: any, signerOrProvider: any) => {
  return new ethers.Contract(contractAddress, abi, signerOrProvider);
};
