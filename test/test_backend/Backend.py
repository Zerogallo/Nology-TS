from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Conecte ao PostgreSQL
DATABASE_URL = os.environ.get('DATABASE_URL')
conn = psycopg2.connect(DATABASE_URL, sslmode='require')
cursor = conn.cursor()

# Criar tabela se não existir
cursor.execute('''
    CREATE TABLE IF NOT EXISTS historico (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(50),
        tipo_cliente VARCHAR(10),
        valor_compra DECIMAL(10,2),
        cashback DECIMAL(10,2),
        data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')
conn.commit()

def calcular_cashback(valor_bruto, desconto_percent, is_vip):
    valor_final = valor_bruto * (1 - desconto_percent / 100)
    cashback_base = valor_final * 0.05
    if valor_final > 500:
        cashback_base *= 2
    if is_vip:
        cashback_final = cashback_base * 1.10
    else:
        cashback_final = cashback_base
    return round(cashback_final, 2)

@app.route('/calcular', methods=['POST'])
def calcular():
    data = request.json
    tipo = data['tipo_cliente']
    valor = float(data['valor_compra'])
    is_vip = (tipo == 'vip')
    
    # Assumindo cupom padrão 0% para este app, mas você pode adicionar campo
    cashback = calcular_cashback(valor, 0, is_vip)
    
    ip = request.remote_addr
    
    cursor.execute(
        "INSERT INTO historico (ip, tipo_cliente, valor_compra, cashback) VALUES (%s, %s, %s, %s)",
        (ip, tipo, valor, cashback)
    )
    conn.commit()
    
    return jsonify({'cashback': cashback})

@app.route('/historico', methods=['GET'])
def historico():
    ip = request.remote_addr
    cursor.execute(
        "SELECT tipo_cliente, valor_compra, cashback, data FROM historico WHERE ip = %s ORDER BY data DESC",
        (ip,)
    )
    rows = cursor.fetchall()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)