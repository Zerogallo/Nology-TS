import psycopg2

try:
    conn = psycopg2.connect(
        host='127.0.0.1',
        database='Nology-ts',
        user='postgres',
        password='admin123',
        port=5432
    )
    print("✅ Conexão bem sucedida!")
    
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"📦 PostgreSQL: {version[0]}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Erro: {e}")