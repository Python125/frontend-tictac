import { useAccount, useSignMessage } from 'wagmi';
import { useState, useEffect } from 'react';
import axios from 'axios';

const apiURL = import.meta.env.VITE_URL;
console.log(apiURL);

function WalletVerification() {
    const { address, isConnected } = useAccount();
    const { data: signature, signMessage } = useSignMessage();
    const [nonce, setNonce] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    // If user connects wallet, request a nonce from server
    useEffect(() => {
        if (isConnected && address) {
            fetchNonce();
        }
    }, [isConnected, address]);

    // Fetch nonce from server
    const fetchNonce = async () => {
        try {
            const response = await axios.get(`${apiURL}/nonce`, {
                params: { address }
            });
            setNonce(response.data.nonce);
        } catch (error) {
            console.error('Error fetching nonce:', error);
        }
    };

    // If user has a nonce and is connected, sign the message
    useEffect(() => {
        if (nonce && address) {
            const message = `Sign this message to verify your wallet ownership: ${nonce}`;
            signMessage({ message });
        }
    }, [nonce, address, signMessage]);

    // If user signs message, verify signature to server
    useEffect(() => {
        if (signature && nonce && address) {
            verifySignature();
        }
    }, [signature, nonce, address]);

    // Verify signature with server
    const verifySignature = async () => {
        try {
            const response = await axios.post(`${apiURL}/verify`, {
                address,
                nonce,
                signature,
            });
            if (response.data.verified) {
                setIsVerified(true);
                saveUserData();
            }
        } catch (error) {
            console.error('Error verifying signature:', error);
        }
    };

    // Save user data to server
    const saveUserData = async () => {
        try {
            await axios.post(`${apiURL}/users`, {
                address,
            });
            console.log('User data saved successfully');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    return (
        <div>
            {!isConnected && <button>Connect Wallet</button>}
            {isConnected && !isVerified && <p>Verifying your wallet ownership...</p>}
            {isVerified && <p>Wallet verified! Your data has been saved.</p>}
        </div>
    );
}

export default WalletVerification;