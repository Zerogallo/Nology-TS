import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Calculator from './components/Calculator'
import Historico from './components/Historico'
import { getHistorico } from './services/api'
import './App.css'

function App() {
  const [historico, setHistorico] = useState([])
  const [loading, setLoading] = useState(true)

  const carregarHistorico = async () => {
    try {
      setLoading(true)
      const data = await getHistorico()
      setHistorico(data)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarHistorico()
  }, [])

  const handleNovaConsulta = () => {
    carregarHistorico()
  }

  return (
    <div className="container">
      <Header />
      <Calculator onNovaConsulta={handleNovaConsulta} />
      <Historico historico={historico} loading={loading} />
    </div>
  )
}

export default App