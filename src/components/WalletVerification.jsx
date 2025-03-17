import { useAccount, useSignMessage } from 'wagmi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setWalletConnection, setWalletNonce, setWalletSignature, setWalletVerification, setWalletError } from '../features/wallet/walletSlice';

const apiURL = import.meta.env.VITE_URL;
// console.log(apiURL);

function WalletVerification() {
    const { address, isConnected } = useAccount();
    const { data: signature, signMessage } = useSignMessage();
    const [nonce, setNonce] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const dispatch = useDispatch();
    const finalDependencies = [isConnected, address, signature, signMessage, nonce];

    useEffect(() => {
        if (isConnected && address) {
            // console.log('Fetching nonce for address:', address);
            console.log('isConnected:', isConnected);
            dispatch(setWalletConnection({ isConnected, address }));
            fetchNonce();
        } else if (nonce && address) {
            const message = `Sign this message to verify your wallet ownership: ${nonce}`;
            dispatch(setWalletNonce(nonce));
            signMessage({ message });
        } else if (signature && nonce && address) {
            dispatch(setWalletSignature(signature));
            verifySignature();
        }
    }, [...finalDependencies]);

    // If user connects wallet, request a nonce from server
    // useEffect(() => {
    //     if (isConnected && address) {
    //         // console.log('Fetching nonce for address:', address);
    //         console.log('isConnected:', isConnected);
    //         dispatch(setWalletConnection({ isConnected, address }));
    //         fetchNonce();
    //     }
    // }, [isConnected, address]);


    // If user has a nonce and is connected, sign the message
    // useEffect(() => {
    //     if (nonce && address) {
    //         const message = `Sign this message to verify your wallet ownership: ${nonce}`;
    //         dispatch(setWalletNonce(nonce));
    //         signMessage({ message });
    //     }
    // }, [nonce, address, signMessage]);

    // If user signs message, verify signature to server
    // useEffect(() => {
    //     if (signature && nonce && address) {
    //         console.log('Signature:', signature);
    //         console.log('Nonce:', nonce);
    //         console.log('Address:', address);
    //         dispatch(setWalletSignature(signature));
    //         verifySignature();
    //     }
    // }, [signature, nonce, address]);

    // Fetch nonce from server
    const fetchNonce = async () => {
        try {
            const response = await axios.get(`${apiURL}/auth/nonce`, {
                params: { address }
            });
            console.log('Received nonce:', response.data.nonce);
            dispatch(setWalletNonce(response.data.nonce));
            setNonce(response.data.nonce);
        } catch (error) {
            console.error('Error fetching nonce:', error);
            dispatch(setWalletError(error.message));
        }
    };

    // Verify signature with server
    const verifySignature = async () => {
        try {
            const response = await axios.post(`${apiURL}/auth/verify`, {
                address,
                nonce,
                signature,
            });
            if (response.data.verified) {
                console.log('Signature verified!');
                dispatch(setWalletVerification(true));
                setIsVerified(true);
                saveUserData();
            }
        } catch (error) {
            console.error('Error verifying signature:', error);
            dispatch(setWalletError(error.message));
        }
    };

    // Save user data to server
    const saveUserData = async () => {
        try {
            const response = await axios.post(`${apiURL}/users`, {
                username: address.slice(0, 8),
                walletAddress: address,
            });
            console.log('User data saved successfully');
            dispatch(setWalletVerification(true));
            setIsVerified(true);
        } catch (error) {
            console.error('Error saving user data:', error);
            dispatch(setWalletError(error.message));
        }
    };

    return (
        <div>
            {/* {!isConnected && <button>Connect Wallet</button>} */}
            {isConnected && !isVerified && (
                <div>
                    <p>Verifying your wallet ownership...</p>
                    <p>Address: {address}</p>
                    <p>Nonce: {nonce ? 'Yes': 'No'}</p>
                    <p>Signature: {signature ? 'Yes': 'No'}</p>
                </div>
            )}
            {isVerified && <p>Wallet verified! Your data has been saved.</p>}
        </div>
    );
}

export default WalletVerification;