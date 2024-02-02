async function createCheckout({ name, cpf, email, total, expireDate, boletoNumber, items }) {
  const body = {
    comprador: {
      tipo: "cliente",
      nome: name,
      cpf_cnpj: cpf,
      email: email,
    },
    itens: items,
    forma_pagamento: {
      boleto: [
        {
          valor: total,
          data_vencimento: expireDate,
          numero_boleto: boletoNumber,
        },
      ],
    },
  };
  
  try {
    const response = await fetch(`http://localhost:80/api/criar_venda.php`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }

  return null;
}
