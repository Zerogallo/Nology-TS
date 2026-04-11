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

  // Função para carregar o histórico
  const carregarHistorico = async () => {
    try {
      console.log('🔄 Carregando histórico...')
      const data = await getHistorico()
      setHistorico(data)
      console.log('✅ Histórico carregado: ${data.length} consultas')
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }

  // Carregar histórico ao iniciar
  useEffect(() => {
    carregarHistorico()
  }, [])

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
      console.log('📊 Calculando cashback...')
      const data = await calcularCashback(tipoCliente, valor, desc)
      setResultado(data)
      console.log('✅ Cashback calculado:', data.cashback)
      
      // 🔄 ATUALIZAR O HISTÓRICO AUTOMATICAMENTE
      await carregarHistorico()
      
      // Opcional: limpar campos
      // setValorCompra('')
      // setDesconto('0')
      
    } catch (error) {
      console.error('Erro ao calcular:', error)
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
              <tbody>
                {historico.map((item, index) => (
                  <tr key={index} className={index === 0 ? 'nova-consulta' : ''}>
                    <td className="ip-column">{item.ip || 'N/A'}</td>
                    <td className="tipo-column">{item.tipo_cliente.toUpperCase()}</td>
                    <td>R$ {parseFloat(item.valor_compra).toFixed(2)}</td>
                    <td>{item.desconto}%</td>
                    <td className="cashback-column">R$ {parseFloat(item.cashback).toFixed(2)}</td>
                    <td className="data-column">{item.data}</td>
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