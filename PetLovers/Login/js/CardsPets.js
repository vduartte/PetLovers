// Inicializa o carousel
$('.carousel').carousel({
  interval: 6000,
  pause: 'hover'
});

// Configuração do vídeo modal
$(function () {
  // Auto play modal video
  $(".video").click(function () {
    var theModal = $(this).data("target"),
      videoSRC = $(this).attr("data-video"),
      videoSRCauto = videoSRC + "?modestbranding=1&rel=0&controls=0&showinfo=0&html5=1&autoplay=1";
    $(theModal + ' iframe').attr('src', videoSRCauto);
    $(theModal + ' button.close').click(function () {
      $(theModal + ' iframe').attr('src', videoSRC);
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const formCadastroPet = document.getElementById('form-cadastro-pet');
  const searchInput = document.getElementById('search');
  const petsContainer = document.getElementById('pets-container');
  const feedbackMessage = document.createElement('div');
  const baseUrl = 'https://projeto-integrado-avaliacao.azurewebsites.net/projeto3/fecaf';
  let editMode = false;
  let editPetId = null;

  // Adiciona feedback para mensagens
  feedbackMessage.id = 'feedbackMessage';
  feedbackMessage.classList.add('alert', 'd-none');
  formCadastroPet.insertAdjacentElement('beforebegin', feedbackMessage);

  // Função para carregar os pets
  async function carregarPets() {
    const response = await fetch(`${baseUrl}/listar/pets`);
    const data = await response.json();
    mostrarPets(data.pets);
  }

  // Função para mostrar os pets
  function mostrarPets(pets) {
    petsContainer.innerHTML = '';
    pets.forEach(pet => {
      const petCard = document.createElement('div');
      petCard.classList.add('col-md-4', 'mb-4');
      petCard.innerHTML = `
        <div class="card h-100">
          <img src="${pet.image}" class="card-img-top img-fluid" alt="${pet.nome}">
          <div class="card-body">
            <h5 class="card-title">${pet.nome}</h5>
            <p class="card-text">Raça: ${pet.raca}</p>
            <p class="card-text">Cor: ${pet.cor}</p>
            <button class="btn btn-danger btn-sm" onclick="excluirPet(${pet.id})">Excluir</button>
            <button class="btn btn-secondary btn-sm" onclick="editarPet(${pet.id})">Editar</button>
          </div>
        </div>
      `;
      petsContainer.appendChild(petCard);
    });
  }

  // Função para mostrar mensagem de feedback
  function mostrarFeedback(mensagem, tipo = 'success') {
    feedbackMessage.textContent = mensagem;
    feedbackMessage.className = `alert alert-${tipo} d-block`;
    setTimeout(() => {
      feedbackMessage.classList.add('d-none');
    }, 3000);
  }

  // Função para cadastrar ou editar um pet
  formCadastroPet.addEventListener('submit', async function (event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const raca = document.getElementById('raca').value;
    const cor = document.getElementById('cor').value;
    const image = document.getElementById('image').value;

    const petData = { nome, raca, cor, image };
    let response;

    if (editMode) {
      response = await fetch(`${baseUrl}/atualizar/pet/${editPetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(petData)
      });
      mostrarFeedback(response.ok ? 'Pet atualizado com sucesso' : 'Erro ao atualizar pet');
    } else {
      response = await fetch(`${baseUrl}/novo/pet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(petData)
      });
      mostrarFeedback(response.ok ? 'Pet cadastrado com sucesso' : 'Erro ao cadastrar pet');
    }

    if (response.ok) {
      carregarPets();
      formCadastroPet.reset();
      editMode = false;
      editPetId = null;
    }
  });

  // Função para excluir um pet
  window.excluirPet = async function (id) {
    const response = await fetch(`${baseUrl}/excluir/pet/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      mostrarFeedback('Pet excluído com sucesso');
      carregarPets();
    } else {
      mostrarFeedback('Erro ao excluir pet', 'danger');
    }
  };

  // Função para editar um pet
  window.editarPet = async function (id) {
    const response = await fetch(`${baseUrl}/buscar/pet/${id}`);
    if (response.ok) {
      const pet = await response.json();
      document.getElementById('nome').value = 'Nome para ser editado';
      document.getElementById('raca').value = 'Raça para ser editado';
      document.getElementById('cor').value = 'Cor para ser editado';
      document.getElementById('image').value = 'Imagem para ser editado';

      editMode = true;
      editPetId = id;
    } else {
      mostrarFeedback('Erro ao buscar dados do pet', 'danger');
    }
  };

  // Função para filtrar os pets pelo nome
  searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    const petCards = document.querySelectorAll('#pets-container .card');
    petCards.forEach(card => {
      const petName = card.querySelector('.card-title').textContent.toLowerCase();
      if (petName.includes(query)) {
        card.parentElement.style.display = 'block';
      } else {
        card.parentElement.style.display = 'none';
      }
    });
  });

  // Carregar os pets ao carregar a página
  carregarPets();
});
