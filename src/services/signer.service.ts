import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import sha256 from "fast-sha256";

const easContractAddress = "0x4200000000000000000000000000000000000021"; 

const schemaUID = "0xbecbf8b1bd8992cbd43db64be07a2cd64a47fadab545ad2e77859f9e753bb5fb";

const eas = new EAS(easContractAddress);

export async function getFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const arrayBuffer = event.target.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const hashUint8Array = sha256(uint8Array);
        const hash = ethers.hexlify(hashUint8Array);
        resolve(hash);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}

export const signData = async (
  name: string,
  startTimestamp: number,
  endTimestamp: number,
  contentHash: string,
  additionalMeta: object
) => {
  let signer = null;
  let provider;
  console.log("Signing data...");

  // Check for Metamask or fallback to default Base Mainnet provider
  if ((window as any).ethereum == null) {
    console.log("Metamask not detected, using default Base Mainnet provider");
    provider = ethers.getDefaultProvider(); 
  } else {
    console.log("Using Metamask for Base network");
    provider = new ethers.BrowserProvider((window as any).ethereum);
    signer = await provider.getSigner();
  }

  if (!signer) {
    throw new Error("No signer found");
  }

  // Connect the EAS instance to the signer
  await eas.connect(signer);

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("bytes32 contentHash,address owner,string name,uint48 startTimestamp,uint48 endTimestamp,string additionalMeta");

  // Encode the attestation data
  const encodedData = schemaEncoder.encodeData([
    { name: "contentHash", value: contentHash, type: "bytes32" },
    { name: "owner", value: await signer.getAddress(), type: "address" },
    { name: "name", value: name, type: "string" },
    { name: "startTimestamp", value: startTimestamp, type: "uint48" },
    { name: "endTimestamp", value: endTimestamp, type: "uint48" },
    { name: "additionalMeta", value: JSON.stringify(additionalMeta), type: "string" },
  ]);

  // Create the attestation on Base
  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: "0x0000000000000000000000000000000000000000",
      expirationTime: BigInt(0),
      revocable: false, 
      data: encodedData,
    },
  });

  // Wait for the transaction to be confirmed
  const newAttestationUID = await tx.wait();
  console.log("New attestation UID:", newAttestationUID);
  return newAttestationUID;
};
