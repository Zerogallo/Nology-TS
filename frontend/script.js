const API_URL = 'http://localhost:5000'; // Mude para sua URL quando hospedar

async function calcularCashback() {
    const tipoCliente = document.getElementById('tipoCliente').value;
    const valorCompra = parseFloat(document.getElementById('valorCompra').value);
    const desconto = parseFloat(document.getElementById('desconto').value);
    
    if (isNaN(valorCompra) || valorCompra <= 0) {
        alert('Por favor, insira um valor válido!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/calcular`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tipo_cliente: tipoCliente,
                valor_compra: valorCompra,
                desconto: desconto
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('cashbackValor').textContent = data.cashback.toFixed(2);
            document.getElementById('valorFinal').textContent = data.valor_final.toFixed(2);
            document.getElementById('resultado').style.display = 'block';
            
            // Carregar histórico novamente
            carregarHistorico();
        } else {
            alert('Erro: ' + data.error);
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor: ' + error.message);
    }
}

async function carregarHistorico() {
    try {
        const response = await fetch(`${API_URL}/historico`);
        const historico = await response.json();
        
        const tbody = document.getElementById('historicoBody');
        
        if (historico.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhuma consulta encontrada</td></tr>';
            return;
        }
        
        tbody.innerHTML = historico.map(item => `
            <tr>
                <td>${item.tipo_cliente.toUpperCase()}</td>
                <td>R$ ${parseFloat(item.valor_compra).toFixed(2)}</td>
                <td>${item.desconto}%</td>
                <td>R$ ${parseFloat(item.cashback).toFixed(2)}</td>
                <td>${item.data}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}

// Permitir Enter para calcular
document.getElementById('valorCompra').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calcularCashback();
    }
});

document.getElementById('desconto').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calcularCashback();
    }
});

// Carregar histórico ao iniciar
carregarHistorico();