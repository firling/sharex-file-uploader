import { useState } from 'react';
import { Text, Group } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconX, IconFile } from '@tabler/icons-react';

interface UploadZoneProps {
    token: string;
    onUpload: (filename: string) => void;
}

const UploadZone = ({ token, onUpload }: UploadZoneProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDrop = async (files: File[]) => {
        setError('');
        setLoading(true);

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch(`${import.meta.env.VITE_BASE_URL || ''}/api/uploadFile`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                const data = await res.json();

                if (!res.ok || !data.success) {
                    setError(data.error || 'Upload failed');
                    return;
                }

                onUpload(data.filename);
            }
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <Dropzone onDrop={handleDrop} loading={loading}>
                <Group position="center" spacing="xl" style={{ minHeight: 80, pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                        <IconUpload size="2rem" stroke={1.5} />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX size="2rem" stroke={1.5} />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconFile size="2rem" stroke={1.5} />
                    </Dropzone.Idle>
                    <Text size="md" inline>
                        Drag files here or click to select
                    </Text>
                </Group>
            </Dropzone>
            {error && <Text color="red" size="sm" mt="xs">{error}</Text>}
        </div>
    );
};

export default UploadZone;
