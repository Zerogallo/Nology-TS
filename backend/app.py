from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Configuração do Flask
app = Flask(__name__)
CORS(app)

# Configurações do banco de dados e servidor a partir das variáveis de ambiente
DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'port': os.getenv('DB_PORT')
}

# Configurações do servidor
SERVER_CONFIG = {
    'host': os.getenv('SERVER_HOST', '0.0.0.0'),
    'port': os.getenv('SERVER_PORT', 5000),
    'debug': os.getenv('DEBUG', 'True').lower() == 'true'
}

# Função para conectar ao banco de dados
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            database=DB_CONFIG['database'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            port=DB_CONFIG['port']
        )
        return conn
    except Exception as e:
        print(f"Erro ao conectar: {e}")
        return None

# Função para inicializar o banco de dados
def init_db():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS historico (
                id SERIAL PRIMARY KEY,
                ip VARCHAR(50),
                tipo_cliente VARCHAR(10),
                valor_compra DECIMAL(10,2),
                cashback DECIMAL(10,2),
                desconto DECIMAL(5,2),
                data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        cursor.close()
        conn.close()
        print("Banco de dados inicializado com sucesso!")
    else:
        print("Erro ao conectar no banco!")

# Função para calcular o cashback
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

# Rota para calcular o cashback
@app.route('/calcular', methods=['POST'])
def calcular():
    try:
        data = request.json
        tipo = data['tipo_cliente']
        valor = float(data['valor_compra'])
        desconto = float(data.get('desconto', 0))
        
        is_vip = (tipo.lower() == 'vip')
        cashback = calcular_cashback(valor, desconto, is_vip)
        
        ip = request.remote_addr
        
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO historico (ip, tipo_cliente, valor_compra, cashback, desconto) VALUES (%s, %s, %s, %s, %s)",
                (ip, tipo, valor, cashback, desconto)
            )
            conn.commit()
            cursor.close()
            conn.close()
        
        return jsonify({
            'success': True,
            'cashback': cashback,
            'valor_final': round(valor * (1 - desconto/100), 2)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Rota para obter o histórico de cálculos
@app.route('/historico', methods=['GET'])
def historico():
    try:
        ip = request.remote_addr
        
        conn = get_db_connection()
        if not conn:
            return jsonify([])
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            "SELECT ip, tipo_cliente, valor_compra, cashback, desconto, data FROM historico WHERE ip = %s ORDER BY data DESC LIMIT 50",
            (ip,)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        
        for row in rows:
            row['data'] = row['data'].strftime('%d/%m/%Y %H:%M:%S')
        
        return jsonify(rows)
    except Exception as e:
        print(f"Erro no histórico: {e}")
        return jsonify([])

# Rota de saúde para verificar se o servidor e o banco estão funcionando
@app.route('/health', methods=['GET'])
def health():
    conn = get_db_connection()
    db_status = "connected" if conn else "disconnected"
    if conn:
        conn.close()
    return jsonify({'status': 'ok', 'database': db_status})


if __name__ == '__main__':
    init_db()
    app.run(debug=SERVER_CONFIG['debug'], host=SERVER_CONFIG['host'], port=SERVER_CONFIG['port'])