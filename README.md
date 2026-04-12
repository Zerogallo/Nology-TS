
Nology-TS/

├── backend/                 # API Flask + PostgreSQL

│   ├── app.py

│   ├── requirements.txt

│   └── Procfile

├── frontend/                # React + Vite

│   ├── src/

│   ├── public/

│   ├── package.json

│   ├── vite.config.js

│   └── .env.production

└── README.md

```

- **Backend:** Flask, Gunicorn, SQLAlchemy (opcional), Flask-CORS
- **Frontend:** React, Vite, Axios
- **Banco de dados:** PostgreSQL (gerenciado pelo Render)
- **Deploy:** Render.com (Web Service + Static Site + PostgreSQL)
```


##  Executando Localmente

### Pré-requisitos
- Python 3.9+
- Node.js 18+
- PostgreSQL (ou SQLite para testes)

## 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate (Windows)

pip install -r requirements.txt

# Configure as variáveis de ambiente (ou crie um .env)
export DATABASE_URL=postgresql://usuario:senha@localhost:5432/cashback
export FRONTEND_URL=http://localhost:3000

python app.py
```

O servidor rodará em http://localhost:5000.

## 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará em http://localhost:3000 e o proxy do Vite redirecionará as chamadas /api para http://localhost:5000.


## Tecnologias Utilizadas

```bash
· Frontend: React 18, Vite, Axios, CSS3
· Backend: Flask, Gunicorn, Flask-CORS, Psycopg2
· Banco de dados: PostgreSQL
· Hospedagem: Render.com
· Controle de versão: Git + GitHub
```

## Licença

Este projeto foi desenvolvido exclusivamente para fins educacionais como parte do processo seletivo da Nology.


## Autor

Desenvolvido por Renan Ferreira – candidato à vaga de Estagiário de Dev na Nology.



