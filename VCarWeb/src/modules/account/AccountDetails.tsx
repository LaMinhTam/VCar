import { useState, useEffect } from 'react';
import { Button, message, Typography } from 'antd';
import { ethers } from 'ethers';

const { Title, Text } = Typography;

const AccountDetails = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        const storedAccount = localStorage.getItem('account');
        if (storedAccount) {
            reconnectMetaMask(storedAccount);
        }
    }, []);

    const connectMetaMask = async () => {
        if (window?.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window?.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const account = accounts[0];
                setAccount(account);
                localStorage.setItem('account', account);

                // Fetch balance
                const balance = await provider.getBalance(account);
                setBalance(ethers.formatEther(balance));

                message.success('Connected to MetaMask');
            } catch (error) {
                console.error(error);
                message.error('Failed to connect to MetaMask');
            }
        } else {
            message.error('MetaMask is not installed');
        }
    };

    const reconnectMetaMask = async (account: string) => {
        if (window?.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window?.ethereum);
                setAccount(account);

                // Fetch balance
                const balance = await provider.getBalance(account);
                setBalance(ethers.formatEther(balance));

                message.success('Reconnected to MetaMask');
            } catch (error) {
                console.error(error);
                message.error('Failed to reconnect to MetaMask');
            }
        } else {
            message.error('MetaMask is not installed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Account Details</Title>
            <Button type="primary" onClick={connectMetaMask}>
                Connect MetaMask
            </Button>
            {account && (
                <div style={{ marginTop: '20px' }}>
                    <Text strong>Connected Account:</Text>
                    <Text>{account}</Text>
                    {balance && (
                        <div style={{ marginTop: '10px' }}>
                            <Text strong>Balance:</Text>
                            <Text>{balance} ETH</Text>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccountDetails;