const API_BASE = 'http://localhost:5000'

// Função para calcular o cashback
export const calcularCashback = async (tipo_cliente, valor_compra, desconto = 0) => {
  const response = await fetch(`${API_BASE}/calcular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tipo_cliente, valor_compra, desconto })
  })
  
  if (!response.ok) {
    throw new Error('Erro ao calcular')
  }
  
  return response.json()
}

// Função para buscar o histórico de cálculos
export const getHistorico = async () => {
  const response = await fetch(`${API_BASE}/historico`)
  
  if (!response.ok) {
    throw new Error('Erro ao buscar histórico')
  }
  
  return response.json()
}