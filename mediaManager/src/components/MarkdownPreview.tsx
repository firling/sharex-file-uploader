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

    // Only render the first part: cap the source so we don't build a huge tree,
    // then clip vertically with a fade so the card stays a fixed-size thumbnail.
    const excerpt = content.split('\n').slice(0, 12).join('\n').slice(0, 600);

    return (
        // react-markdown sanitizes by default (no raw HTML), so untrusted
        // markdown can't inject scripts into the manager origin.
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: '#fff',
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    padding: '0.5rem',
                    color: '#000',
                    textAlign: 'left',
                    fontSize: '0.7rem',
                    lineHeight: 1.4,
                }}
            >
                <ReactMarkdown>{excerpt}</ReactMarkdown>
            </div>
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '2.5rem',
                    background: 'linear-gradient(rgba(255,255,255,0), #fff)',
                }}
            />
        </div>
    );
};

export default MarkdownPreview;
