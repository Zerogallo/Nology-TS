import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const calcularCashback = async (tipoCliente, valorCompra, desconto = 0) => {
  try {
    const response = await api.post('/calcular', {
      tipo_cliente: tipoCliente,
      valor_compra: valorCompra,
      desconto: desconto,
    })
    return response.data
  } catch (error) {
    console.error('Erro na API:', error)
    throw error
  }
}

export const getHistorico = async () => {
  try {
    const response = await api.get('/historico')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return []
  }
}

export const getConfig = async () => {
  try {
    const response = await api.get('/config')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar config:', error)
    return {}
  }
}

export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    return { status: 'error', database: 'offline' }
  }
}