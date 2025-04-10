import { useState, React, useEffect } from "react";
import axios from "axios";
import { Text, Button, Box, Link, Input } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount } from 'wagmi';
// import { config } from '../wagmi.config';
import { Account } from './Account';
import WalletOptions from './WalletOptions';

function SingleGamePage() {
    const [isConnected, setIsConnected] = useState(false);
    const { gameId } = useParams();
  
    function ConnectWallet() {
      const { isConnected } = useAccount();
      useEffect(() => {
        setIsConnected(isConnected);
      }, [isConnected]);
      if (isConnected) return <Account />;
      return <WalletOptions />;
    }

    const queryClient = new QueryClient();
    return (
        <Box>
            {/* <WagmiProvider config={config}> */}
                {/* <QueryClientProvider client={queryClient}> */}
                    <ConnectWallet />
                    <Text fontWeight='bold' fontSize='2xl'>Welcome to your game session</Text>
                    <Button type="submit" variant='solid' href={'/'} marginTop='1rem' _hover={{backgroundColor: 'gray.600'}}>Join Game</Button>
                {/* </QueryClientProvider> */}
            {/* </WagmiProvider> */}
        </Box>
    )
}

export default SingleGamePage;