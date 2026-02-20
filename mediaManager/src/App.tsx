import { useState, useEffect, useCallback } from 'react'
import { SimpleGrid, Button, Group } from '@mantine/core'
import './App.css'
import Card from './components/Card'
import LoginForm from './components/LoginForm'
import UploadZone from './components/UploadZone'

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [files, setFiles] = useState<string[]>([]);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    setFiles([]);
  }, []);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }
    return res;
  }, [token, logout]);

  useEffect(() => {
    if (!token) return;
    authFetch(`${import.meta.env.VITE_BASE_URL || ''}/api/getAllFile`)
      .then((res) => res.json())
      .then((data) => setFiles(data.files))
      .catch(() => {});
  }, [token, authFetch]);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const onDelete = (file: string) => {
    setFiles(files.filter((f) => f !== file));
    authFetch(`${import.meta.env.VITE_BASE_URL || ''}/api/deleteFile/${file}`, { method: 'DELETE' });
  };

  const onUpload = (filename: string) => {
    setFiles((prev) => [filename, ...prev]);
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <>
      <Group position="right" mb="md">
        <Button variant="subtle" color="gray" onClick={logout}>
          Logout
        </Button>
      </Group>
      <UploadZone token={token} onUpload={onUpload} />
      <SimpleGrid
        cols={4}
        spacing="lg"
        breakpoints={[
          { maxWidth: '62rem', cols: 3, spacing: 'md' },
          { maxWidth: '48rem', cols: 2, spacing: 'sm' },
          { maxWidth: '36rem', cols: 1, spacing: 'sm' },
        ]}
      >
        {files.map((file) => <Card key={file} file={file} onDelete={onDelete}/>)}
      </SimpleGrid>
    </>
  )
}

export default App
