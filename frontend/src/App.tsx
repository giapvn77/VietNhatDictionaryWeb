import { useEffect, useState } from 'react'
import { apiClient } from './api/client'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ok' | 'unreachable'>('checking')

  useEffect(() => {
    apiClient
      .get('/health')
      .then(() => setBackendStatus('ok'))
      .catch(() => setBackendStatus('unreachable'))
  }, [])

  return (
    <main>
      <h1>Từ Điển Việt-Nhật</h1>
      <p>Backend status: {backendStatus}</p>
    </main>
  )
}

export default App
