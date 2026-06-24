import { useState } from 'react';
import { Textarea, Select, Button, Group, Text, Paper } from '@mantine/core';
import { IconClipboardText } from '@tabler/icons-react';

interface PasteTextProps {
    token: string;
    onUpload: (filename: string) => void;
}

// Extension → MIME type used when synthesizing the File. The served
// Content-Type ultimately comes from express.static (by extension), but a
// correct type here keeps the upload self-describing.
const EXTENSIONS: { value: string; label: string; mime: string }[] = [
    { value: 'txt', label: 'txt', mime: 'text/plain' },
    { value: 'md', label: 'md', mime: 'text/markdown' },
    { value: 'html', label: 'html', mime: 'text/html' },
    { value: 'csv', label: 'csv', mime: 'text/csv' },
    { value: 'json', label: 'json', mime: 'application/json' },
    { value: 'xml', label: 'xml', mime: 'application/xml' },
    { value: 'yaml', label: 'yaml', mime: 'text/yaml' },
    { value: 'svg', label: 'svg', mime: 'image/svg+xml' },
    { value: 'log', label: 'log', mime: 'text/plain' },
];

const PasteText = ({ token, onUpload }: PasteTextProps) => {
    const [text, setText] = useState('');
    const [ext, setExt] = useState('txt');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setError('');
        setLoading(true);

        try {
            const mime = EXTENSIONS.find((e) => e.value === ext)?.mime || 'text/plain';
            const file = new File([text], `paste.${ext}`, { type: mime });
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
            setText('');
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper withBorder p="md" mb="md">
            <Textarea
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                placeholder="Paste or type text here…"
                minRows={4}
                autosize
                maxRows={12}
            />
            <Group position="apart" mt="sm">
                <Select
                    data={EXTENSIONS}
                    value={ext}
                    onChange={(v) => setExt(v || 'txt')}
                    searchable
                    creatable
                    getCreateLabel={(query) => `+ .${query}`}
                    onCreate={(query) => {
                        const item = { value: query, label: query, mime: 'text/plain' };
                        EXTENSIONS.push(item);
                        return item;
                    }}
                    w={140}
                />
                <Button
                    leftIcon={<IconClipboardText size="1.1rem" />}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!text.trim()}
                >
                    Upload as .{ext}
                </Button>
            </Group>
            {error && <Text color="red" size="sm" mt="xs">{error}</Text>}
        </Paper>
    );
};

export default PasteText;
