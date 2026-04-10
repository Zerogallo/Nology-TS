import React from 'react'
import cashbackSvg from '../../public/cupom.png'

function Header() {
  return (
    <header>
      <div className="logo-svg">
        <img src={cashbackSvg} alt="Cashback Logo" width="80" height="80" />
      </div>
      <h1>Calculadora de Cashback</h1>
      <p>Programa de recompensas da Cashback</p>
    </header>
  )
}

export default Header