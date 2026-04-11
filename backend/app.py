from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env (apenas para desenvolvimento local)
load_dotenv()

app = Flask(__name__)
CORS(app)

# Em desenvolvimento local (origem do Vite)
origins = [
    "http://localhost:5173",      # desenvolvimento local
    os.getenv("FRONTEND_URL", "https://frontend-872t.onrender.com")     # URL do frontend no Render
]
CORS(app, origins=origins)

def get_db_connection():
    """Retorna uma conexão com o PostgreSQL, priorizando DATABASE_URL (Render)"""
    # Para o Render: usa a variável DATABASE_URL fornecida automaticamente
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        # Corrige possíveis URLs com 'postgres://' para 'postgresql://'
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        try:
            return psycopg2.connect(database_url)
        except Exception as e:
            print(f"Erro via DATABASE_URL: {e}")

    # Fallback para desenvolvimento local (variáveis separadas)
    try:
        return psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT')
        )
    except Exception as e:
        print(f"Erro com variáveis separadas: {e}")
        return None

def init_db():
    """Cria a tabela 'historico' se não existir"""
    conn = get_db_connection()
    if conn:
        try:
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
            print("✅ Banco de dados inicializado com sucesso!")
        except Exception as e:
            print(f"Erro ao criar tabela: {e}")
        finally:
            conn.close()
    else:
        print("❌ Erro ao conectar no banco para inicialização!")

# Inicializa o banco ao subir a aplicação (funciona com Gunicorn)
init_db()

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

@app.route('/')
def index():
    return jsonify({
        'mensagem': 'Bem-vindo à API de Cashback!',
        'status': 'online',
        'endpoints_disponiveis': {
            'calcular': '/calcular (POST)',
            'historico': '/historico (GET)',
            'health': '/health (GET)'
        }
    }), 200

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
            try:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO historico (ip, tipo_cliente, valor_compra, cashback, desconto) VALUES (%s, %s, %s, %s, %s)",
                    (ip, tipo, valor, cashback, desconto)
                )
                conn.commit()
                cursor.close()
            except Exception as e:
                print(f"Erro ao inserir: {e}")
            finally:
                conn.close()

        return jsonify({
            'success': True,
            'cashback': cashback,
            'valor_final': round(valor * (1 - desconto/100), 2)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

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

@app.route('/health', methods=['GET'])
def health():
    conn = get_db_connection()
    db_status = "connected" if conn else "disconnected"
    if conn:
        conn.close()
    return jsonify({'status': 'ok', 'database': db_status})

if __name__ == '__main__':
    # Render define a porta na variável PORT, caso contrário usa 5000
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    app.run(debug=debug, host='0.0.0.0', port=port)