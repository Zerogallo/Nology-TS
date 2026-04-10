import React, { useState } from 'react'
import { calcularCashback } from '../services/api'

function Calculator({ onNovaConsulta }) {
  const [tipoCliente, setTipoCliente] = useState('comum')
  const [valorCompra, setValorCompra] = useState('')
  const [desconto, setDesconto] = useState('0')
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const valor = parseFloat(valorCompra)
    const desc = parseFloat(desconto)
    
    if (isNaN(valor) || valor <= 0) {
      setError('Por favor, insira um valor válido!')
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      const data = await calcularCashback(tipoCliente, valor, desc)
      setResultado(data)
      onNovaConsulta()
      
      // Limpar campos após cálculo (opcional)
      // setValorCompra('')
      // setDesconto('0')
    } catch (error) {
      setError('Erro ao calcular cashback. Tente novamente.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="calculator-card">
      <h2>Consulta Cashback</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo de Cliente:</label>
          <select 
            value={tipoCliente} 
            onChange={(e) => setTipoCliente(e.target.value)}
          >
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
            placeholder="Ex: 600.00"
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

      {error && <div className="error-message">{error}</div>}

      {resultado && (
        <div className="resultado">
          <h3>🎉 Cashback Calculado</h3>
          <div className="cashback-value">R$ {resultado.cashback.toFixed(2)}</div>
          <div className="valor-final">
            Valor final com desconto: R$ {resultado.valor_final.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  )
}

export default Calculator