const API_URL = 'http://localhost:5000'; // Ajuste para sua URL da API

async function calcularCashback() {
    const tipoCliente = document.getElementById('tipoCliente').value;
    const valorCompra = parseFloat(document.getElementById('valorCompra').value);
    const desconto = parseFloat(document.getElementById('desconto').value) || 0;

    // Validação básica
    if (!valorCompra || valorCompra <= 0) {
        alert('Por favor, insira um valor de compra válido!');
        return;
    }

    if (desconto < 0 || desconto > 100) {
        alert('O desconto deve estar entre 0 e 100%!');
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
            // Exibe o resultado
            document.getElementById('cashbackValor').textContent = data.cashback.toFixed(2);
            document.getElementById('valorFinal').textContent = data.valor_final.toFixed(2);
            document.getElementById('resultado').style.display = 'block';
            
            // Recarrega o histórico
            carregarHistorico();
            
            // Limpa o campo de valor
            document.getElementById('valorCompra').value = '';
        } else {
            alert('Erro ao calcular: ' + data.error);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor!');
    }
}

async function carregarHistorico() {
    try {
        const response = await fetch(`${API_URL}/historico`);
        const historico = await response.json();
        
        const tbody = document.getElementById('historicoBody');
        
        if (historico.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum registro encontrado</td></tr>';
            return;
        }
        
        tbody.innerHTML = historico.map(item => `
            <tr>
                <td>${item.tipo_cliente.toUpperCase()}</td>
                <td>R$ ${parseFloat(item.valor_compra).toFixed(2)}</td>
                <td>${parseFloat(item.desconto).toFixed(1)}%</td>
                <td class="cashback-highlight">R$ ${parseFloat(item.cashback).toFixed(2)}</td>
                <td>${item.data}</td>
                <td>${item.ip || 'N/A'}</td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        document.getElementById('historicoBody').innerHTML = '<tr><td colspan="6" style="text-align: center;">Erro ao carregar histórico</td></tr>';
    }
}

// Carrega o histórico ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico();
    
    // Permite pressionar Enter para calcular
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calcularCashback();
            }
        });
    });
});