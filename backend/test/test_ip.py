import requests

# Descobre o IP público real
meu_ip = requests.get('https://api.ipify.org').text
print(f'Meu IP: {meu_ip}')

# Faz uma consulta
resp = requests.post('http://localhost:5000/calcular', json={
    'tipo_cliente': 'vip',
    'valor_compra': 600,
    'desconto': 20
})

# Busca o histórico e vê se o IP salvo é o mesmo
historico = requests.get('http://localhost:5000/historico').json()
for item in historico:
    print(f"IP salvo no banco: {item['ip']} -> {'✅' if item['ip'] == meu_ip else '❌'}")