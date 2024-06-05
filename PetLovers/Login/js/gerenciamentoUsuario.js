async function registerUser() {
  // Capturar os dados do formulário
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmpassword').value;

  // Verificar se as senhas coincidem
  if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
  }

  // Criar o objeto com os dados do usuário
  const user = {
      nome: name,
      email: email,
      senha: password
  };

  try {
      // Enviar a requisição para a API
      const response = await fetch('https://back-login.vercel.app/usuarios', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
      });

      // Verificar se a requisição foi bem-sucedida
      if (response.ok) {
          // Exibir mensagem de sucesso
          alert('Usuário cadastrado com sucesso!');
      } else {
          // Exibir mensagem de erro
          alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
      }
  } catch (error) {
      // Exibir mensagem de erro em caso de falha na conexão com a API
      console.error('Erro:', error);
      alert('Erro ao conectar com a API.');
  }
}

document.querySelector('#botão-cadastrar').addEventListener('click', registerUser);