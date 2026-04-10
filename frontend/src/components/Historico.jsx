import React from 'react'
import LoadingSpinner from './LoadingSpinner'

function Historico({ historico, loading }) {
  const getMeuIp = () => {
    if (historico.length > 0 && historico[0].ip) {
      return historico[0].ip
    }
    return 'carregando...'
  }

  if (loading) {
    return (
      <div className="historico-card">
        <h2>📋 Histórico de Consultas</h2>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="historico-card">
      <h2>📋 Histórico de Consultas</h2>
      <div className="info-ip">
        <small>🔒 Mostrando apenas consultas do seu IP: <strong>{getMeuIp()}</strong></small>
      </div>
      
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>IP</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Desconto</th>
              <th>Cashback</th>
              <th>Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            {historico.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Nenhuma consulta encontrada
                </td>
              </tr>
            ) : (
              historico.map((item, index) => (
                <tr key={index}>
                  <td className="ip-column">{item.ip || 'N/A'}</td>
                  <td>{item.tipo_cliente.toUpperCase()}</td>
                  <td>R$ {parseFloat(item.valor_compra).toFixed(2)}</td>
                  <td>{item.desconto}%</td>
                  <td className="cashback-value-table">R$ {parseFloat(item.cashback).toFixed(2)}</td>
                  <td>{item.data}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Historico