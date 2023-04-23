import { useState, useEffect } from 'react'
import { SimpleGrid } from '@mantine/core'
import './App.css'
import Card from './components/Card'

function App() {
  const [files, setFiles] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/getAllFile`)
      .then((res) => res.json())
      .then((data) => setFiles(data.files))
  }, []);

  const onDelete = (file: string) => {
    setFiles(files.filter((f) => f !== file))
    fetch(`${import.meta.env.VITE_BASE_URL}/api/deleteFile/${file}`, { method: 'DELETE' })
  }

  return (
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
  )
}

export default App
