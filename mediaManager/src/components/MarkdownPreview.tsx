import { useEffect, useState } from 'react';
import { Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
    url: string;
}

const MarkdownPreview = ({ url }: MarkdownPreviewProps) => {
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error('fetch failed');
                return res.text();
            })
            .then((text) => { if (!cancelled) setContent(text); })
            .catch(() => { if (!cancelled) setError(true); });
        return () => { cancelled = true; };
    }, [url]);

    if (error) return <Text color="red" size="sm">Aperçu indisponible</Text>;
    if (content === null) return <Text color="dimmed" size="sm">Chargement…</Text>;

    return (
        // react-markdown sanitizes by default (no raw HTML), so untrusted
        // markdown can't inject scripts into the manager origin.
        <div
            style={{
                width: '100%',
                height: '100%',
                padding: '0.5rem',
                background: '#fff',
                color: '#000',
                textAlign: 'left',
                fontSize: '0.75rem',
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};

export default MarkdownPreview;
