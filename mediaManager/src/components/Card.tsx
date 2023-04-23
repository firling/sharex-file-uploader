import {Paper, Text, ActionIcon} from '@mantine/core';
import { IconTrash, IconFileFilled } from '@tabler/icons-react';
// @ts-ignore
import VideoThumbnail from 'react-video-thumbnail';

interface CardProps {
    file: string,
    onDelete: (file: string) => void,
}

const Card = ({file, onDelete}: CardProps) => {
    const url = `${import.meta.env.VITE_BASE_URL}/static/${file}`

    const isImage = (ext: string | undefined) => {
        const images = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'apng', 'avif', 'webp', 'bmp', 'ico', 'cur', 'tif', 'tiff']
        return images.includes(ext!)
    }

    const isVideo = (ext: string | undefined) => {
        const videos = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi', 'wmv', 'flv', '3gp', 'm4v', 'mpg', 'mpeg']
        return videos.includes(ext!)
    }

    const getType = (file: string) => {
        const ext = file.split('.').pop()
        if (isImage(ext)) return 'image'
        if (isVideo(ext)) return 'video'
        return 'other'
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
                }}
            >
                <Text>{file}</Text>
                <ActionIcon onClick={() => onDelete(file)} color="red" size="lg">
                    <IconTrash size="1.625rem" />
                </ActionIcon>
            </div>
            <div 
                style={{
                    flex: '1 1 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={() => window.open(url)}
            >
                {getType(file) === 'image' ? <img src={url} alt={file}/> 
                : getType(file) === 'video' ? <VideoThumbnail videoUrl={url} /> : <IconFileFilled size="5rem" />}
            </div>
        </Paper>
    );
}
 
export default Card;