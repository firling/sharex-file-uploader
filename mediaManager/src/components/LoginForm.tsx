import { useState } from 'react';
import { Paper, TextInput, PasswordInput, Button, Text, Stack } from '@mantine/core';

interface LoginFormProps {
    onLogin: (token: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.error || 'Login failed');
                return;
            }

            onLogin(data.token);
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Paper withBorder p="xl" sx={{ width: 360 }}>
                <form onSubmit={handleSubmit}>
                    <Stack>
                        <TextInput
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.currentTarget.value)}
                            required
                        />
                        <PasswordInput
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            required
                        />
                        {error && <Text color="red" size="sm">{error}</Text>}
                        <Button type="submit" loading={loading} fullWidth>
                            Login
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </div>
    );
};

export default LoginForm;
