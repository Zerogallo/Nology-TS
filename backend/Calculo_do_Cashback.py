def calcular_cashback(valor_bruto, desconto_percent, is_vip):
    valor_final = valor_bruto * (1 - desconto_percent / 100)
    
    cashback_base = valor_final * 0.05
    
    # Promoção: dobra cashback se valor final > 500
    if valor_final > 500:
        cashback_base *= 2
    
    # Bônus VIP sobre o cashback atual
    if is_vip:
        cashback_final = cashback_base * 1.10
    else:
        cashback_final = cashback_base
    
    return round(cashback_final, 2)