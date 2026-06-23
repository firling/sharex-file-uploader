import {Paper, Text, ActionIcon, Tooltip, Group} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconTrash, IconFileFilled, IconLink, IconCheck } from '@tabler/icons-react';
// @ts-ignore
import VideoThumbnail from 'react-video-thumbnail';
// @ts-ignore
import { LazyLoadImage } from 'react-lazy-load-image-component';
import MarkdownPreview from './MarkdownPreview';

interface CardProps {
    file: string,
    onDelete: (file: string) => void,
}

const Card = ({file, onDelete}: CardProps) => {
    const url = `${import.meta.env.VITE_BASE_URL || ''}/static/${file}`
    const shareUrl = new URL(url, window.location.origin).href
    const clipboard = useClipboard({ timeout: 1500 })

    const isImage = (ext: string | undefined) => {
        const images = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'apng', 'avif', 'webp', 'bmp', 'ico', 'cur', 'tif', 'tiff']
        return images.includes(ext!)
    }

    const isVideo = (ext: string | undefined) => {
        const videos = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi', 'wmv', 'flv', '3gp', 'm4v', 'mpg', 'mpeg']
        return videos.includes(ext!)
    }

    const isHtml = (ext: string | undefined) => {
        const html = ['html', 'htm']
        return html.includes(ext!)
    }

    const isMarkdown = (ext: string | undefined) => {
        const markdown = ['md', 'markdown']
        return markdown.includes(ext!)
    }

    const getType = (file: string) => {
        const ext = file.split('.').pop()?.toLowerCase()
        if (isImage(ext)) return 'image'
        if (isVideo(ext)) return 'video'
        if (isHtml(ext)) return 'html'
        if (isMarkdown(ext)) return 'markdown'
        return 'other'
    }

    const type = getType(file)

    const preview = () => {
        if (type === 'image') {
            return <LazyLoadImage alt={file} effect="blur" src={url} />
        }
        if (type === 'video') {
            return <VideoThumbnail videoUrl={url} />
        }
        if (type === 'markdown') {
            return <MarkdownPreview url={url} />
        }
        if (type === 'html') {
            // Sandboxed (no allow-scripts): the preview cannot run the uploaded
            // page's JS, so it can't reach the manager's localStorage token.
            return (
                <iframe
                    src={url}
                    title={file}
                    sandbox=""
                    scrolling="no"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 0,
                        pointerEvents: 'none',
                        background: '#fff',
                    }}
                />
            )
        }
        return <IconFileFilled size="5rem" />
    }

    return (
        <Paper withBorder p="md" sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Text truncate>{file}</Text>
                <Group spacing="xs" noWrap>
                    <Tooltip label={clipboard.copied ? 'Lien copié' : 'Copier le lien'} withArrow>
                        <ActionIcon
                            onClick={() => clipboard.copy(shareUrl)}
                            color={clipboard.copied ? 'teal' : 'blue'}
                            size="lg"
                        >
                            {clipboard.copied ? <IconCheck size="1.5rem" /> : <IconLink size="1.5rem" />}
                        </ActionIcon>
                    </Tooltip>
                    <ActionIcon onClick={() => onDelete(file)} color="red" size="lg">
                        <IconTrash size="1.625rem" />
                    </ActionIcon>
                </Group>
            </div>
            <div
                style={{
                    flex: '1 1 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    minHeight: type === 'html' || type === 'markdown' ? 180 : undefined,
                    overflow: 'hidden',
                }}
                onClick={() => window.open(url)}
            >
                {preview()}
            </div>
        </Paper>
    );
}

export default Card;
