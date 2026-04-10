import React, { useState, useEffect } from 'react'
import { calcularCashback, getHistorico } from './services/api'
import './App.css'
import cashbackSvg from '../public/cupom.png'

function App() {
  const [tipoCliente, setTipoCliente] = useState('comum')
  const [valorCompra, setValorCompra] = useState('')
  const [desconto, setDesconto] = useState('0')
  const [resultado, setResultado] = useState(null)
  const [historico, setHistorico] = useState([])
  const [loading, setLoading] = useState(false)

  // Carregar histórico ao iniciar
  useEffect(() => {
    carregarHistorico()
  }, [])

  const carregarHistorico = async () => {
    try {
      const data = await getHistorico()
      setHistorico(data)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const handleCalcular = async (e) => {
    e.preventDefault()
    
    const valor = parseFloat(valorCompra)
    const desc = parseFloat(desconto)
    
    if (isNaN(valor) || valor <= 0) {
      alert('Digite um valor válido')
      return
    }
    
    setLoading(true)
    
    try {
      const data = await calcularCashback(tipoCliente, valor, desc)
      setResultado(data)
      await carregarHistorico() // Recarregar histórico
      
      // Limpar campos (opcional)
      // setValorCompra('')
    } catch (error) {
      alert('Erro ao calcular: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
        <header>
          <div className="logo-svg">
            <img src={cashbackSvg} alt="Cashback Logo" width="80" height="80" />
          </div>
          <h1>Calculadora de Cashback</h1>
          <p>Programa de recompensas da Cashback</p>
        </header>

      {/* Formulário */}
      <div className="card">
        <h2>Consulta Cashback</h2>
        <form onSubmit={handleCalcular}>
          <div className="form-group">
            <label>Tipo de Cliente:</label>
            <select value={tipoCliente} onChange={(e) => setTipoCliente(e.target.value)}>
              <option value="comum">Comum</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div className="form-group">
            <label>Valor da Compra (R$):</label>
            <input
              type="number"
              step="0.01"
              value={valorCompra}
              onChange={(e) => setValorCompra(e.target.value)}
              placeholder="Ex: 600"
              required
            />
          </div>

          <div className="form-group">
            <label>Desconto (%):</label>
            <input
              type="number"
              step="0.1"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
              placeholder="Ex: 20"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular Cashback'}
          </button>
        </form>

        {resultado && (
          <div className="resultado">
            <h3>🎉 Cashback Calculado</h3>
            <div className="cashback-value">R$ {resultado.cashback.toFixed(2)}</div>
            <div>Valor final: R$ {resultado.valor_final.toFixed(2)}</div>
          </div>
        )}
      </div>

      {/* Histórico */}
      <div className="card">
        <h2>📋 Histórico de Consultas</h2>
        {historico.length === 0 ? (
          <p>Nenhuma consulta encontrada</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>IP</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Desconto</th>
                  <th>Cashback</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody className="historico-body">
                {historico.map((item, index) => (
                  <tr key={index}>
                    <td className="ip-column">{item.ip || 'N/A'}</td>
                    <td>{item.tipo_cliente.toUpperCase()}</td>
                    <td>R$ {parseFloat(item.valor_compra).toFixed(2)}</td>
                    <td>{item.desconto}%</td>
                    <td>R$ {parseFloat(item.cashback).toFixed(2)}</td>
                    <td>{item.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default App