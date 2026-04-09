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

# Interface interativa
print("=== CALCULADORA DE CASHBACK ===\n")

while True:
    try:
        valor = float(input("Valor da compra (R$): "))
        desconto = float(input("Desconto (%): "))
        vip = input("Cliente VIP? (s/n): ").lower() == 's'
        
        resultado = calcular_cashback(valor, desconto, vip)
        print(f"\n💰 Cashback: R$ {resultado}\n")
        
        continuar = input("Calcular novamente? (s/n): ")
        if continuar.lower() != 's':
            break
        print()
    except:
        print("Erro! Digite números válidos.\n")