// AcademiaModal.tsx
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { signData } from '../services/signer.service';
import { ethers } from 'ethers';

interface AcademiaModalProps {
  onClose: () => void;
}

const AcademiaModal: React.FC<AcademiaModalProps> = ({ onClose }) => {
  const { address, isConnected } = useAccount();
  const [form, setForm] = useState({
    contentHash: '',
    name: '',
    startTimestamp: '',
    endTimestamp: '',
    additionalMeta: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      console.error('Wallet is not connected');
      return;
    }

    try {
      setIsSubmitting(true);
      const { contentHash, name, startTimestamp, endTimestamp, additionalMeta } = form;

      // Convert startTimestamp and endTimestamp to numbers
      const startTs = parseInt(startTimestamp, 10);
      const endTs = parseInt(endTimestamp, 10);

      const additionalMetaObj = JSON.parse(additionalMeta);

      // Request network switch to Base Mainnet if needed
      if (typeof (window as any).ethereum !== 'undefined') {
        const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x2105') {
          console.log('Switching to Base Mainnet...');
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x2105',
                rpcUrls: ['https://mainnet.base.org'],
                chainName: 'Base Mainnet',
                nativeCurrency: {
                  name: 'Base',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://basescan.org/'],
              },
            ],
          });
        }
      } else {
        console.error('MetaMask is not installed.');
        return;
      }

      // Ensure the provider and signer are properly set for the attestation
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      if (!signer) {
        throw new Error('No signer found');
      }

      console.log('Submitting transaction for attestation...');
      const attestationUID = await signData(name, startTs, endTs, contentHash, additionalMetaObj);
      console.log('Attestation successful. UID:', attestationUID);
      onClose();
    } catch (err) {
      console.error('Error creating attestation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Academia Attestation Form</h2>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          name="contentHash"
          value={form.contentHash}
          onChange={handleChange}
          placeholder="Content Hash"
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          name="startTimestamp"
          value={form.startTimestamp}
          onChange={handleChange}
          placeholder="Start Timestamp"
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          name="endTimestamp"
          value={form.endTimestamp}
          onChange={handleChange}
          placeholder="End Timestamp"
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          name="additionalMeta"
          value={form.additionalMeta}
          onChange={handleChange}
          placeholder="Additional Meta"
        />
        <div className="flex justify-end space-x-4">
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademiaModal;