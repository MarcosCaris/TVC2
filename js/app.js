document.addEventListener('DOMContentLoaded', () => {
	const preloader = document.querySelector('.preloader-container');
	const logo = document.querySelector('.logo');
	const backToTop = document.getElementById('backToTop');

	window.addEventListener('load', () => {
		setTimeout(() => {
			preloader.style.opacity = 0;
			preloader.style.pointerEvents = 'none';
		}, 1300);

		logo.style.filter = 'grayscale(0%)';
	});
	window.addEventListener('scroll', function () {
		if (window.pageYOffset > 100) {
			backToTop.classList.add('show');
		} else {
			backToTop.classList.remove('show');
		}
	});

	// Funcionalidad para subir al principio
	backToTop.addEventListener('click', function () {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	});
});

// Keep track of selected cards
let selectedCards = [];

function toggleCard(glass__server__card) {
	glass__server__card.classList.toggle('selected');

	// Update the selected cards array
	selectedCards = Array.from(document.querySelectorAll('.glass__server__card.selected'));
}

function elegirCartaRandom() {
	const numberOfSelectedCards = selectedCards.length;

	if (numberOfSelectedCards === 0) {
		alert('Please select at least one card.');
		return;
	}

	// Calculate the probability for each card
	const probability = 100 / numberOfSelectedCards;

	// Generate a random number between 0 and 100
	const randomValue = Math.random() * 100;

	// Find the selected card based on the random number
	let selectedCardIndex = Math.floor(randomValue / probability);

	// If the random number is exactly 100, adjust the index
	selectedCardIndex = selectedCardIndex === numberOfSelectedCards ? numberOfSelectedCards - 1 : selectedCardIndex;

	const selectedCard = selectedCards[selectedCardIndex];

	// Simulate a server request (replace this with an actual server request)
	simulateServerRequest(selectedCard);
}

function simulateServerRequest(selectedCard) {
	// Remove the 'selected' class from all server cards
	document.querySelectorAll('.glass__server__card').forEach((card) => {
		card.classList.remove('selected');
		card.classList.remove('chosen');
	});

	// Add the 'selected' and 'chosen' classes to the clicked server card
	selectedCard.classList.add('selected');
	selectedCard.classList.add('chosen');
}
function reiniciarSorteo() {
	document.querySelectorAll('.glass__server__card').forEach((card) => {
		card.classList.remove('selected');
		card.classList.remove('chosen');
	});
}

let observador = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		console.log(entry);
		if (entry.isIntersecting) {
			entry.target.classList.add('mostrar');

			// Disconnect the observer once the element is visible
			observer.unobserve(entry.target);
		}
	});
});

let cartasAnimacion = document.querySelectorAll('.oculto');
cartasAnimacion.forEach((el) => observador.observe(el));

function ScrollToServidores() {
	const targetSection = document.getElementById('tp__servidores');
	const sectionStart = targetSection.offsetTop;

	// Adjust the scroll position to be a little higher, e.g., subtracting 20 pixels
	const scrollPosition = sectionStart - 310;

	window.scrollTo({
		top: scrollPosition,
		behavior: 'smooth',
	});
}
function ScrollToBracket() {
	const targetSection = document.getElementById('tp__bracket');
	const sectionStart = targetSection.offsetTop;

	// Adjust the scroll position to be a little higher, e.g., subtracting 20 pixels
	const scrollPosition = sectionStart - 50;

	window.scrollTo({
		top: scrollPosition,
		behavior: 'smooth',
	});
}
function ScrollToCapitanes() {
	const targetSection = document.getElementById('capitanes__tp');
	const sectionStart = targetSection.offsetTop;

	// Adjust the scroll position to be a little higher, e.g., subtracting 20 pixels
	const scrollPosition = sectionStart + 0;

	window.scrollTo({
		top: scrollPosition,
		behavior: 'smooth',
	});
}
document.addEventListener('DOMContentLoaded', function () {
	const cartas = document.querySelectorAll('.mejora__carta');
	const cartasInvisibles = document.querySelectorAll('.invisible__carta');
	const contenedorCartasSeleccionadas = document.getElementById('pickedCardsContainer');
	const contenedorUltimaSeleccion = document.getElementById('ultima__seleccion__carta');
	const botonMezclar = document.getElementById('shuffleButton');
	const initialPlaceholderText = 'SELECCIONA UNA CARTA PARA COMENZAR';

	// Add initial text node to the container
	const placeholderTextNode = document.createTextNode(initialPlaceholderText);
	contenedorCartasSeleccionadas.appendChild(placeholderTextNode);

	// Add a class to the container
	contenedorCartasSeleccionadas.classList.add('containerPlaceHolder');

	let ultimasCartasSeleccionadas = [];
	let cartasRestantes = Array.from(cartas);

	// Mezclar y distribuir las cartas inicialmente
	mezclarCartas();

	// Agregar reconocedor de eventos de click a cada carta
	cartas.forEach((carta) => {
		carta.addEventListener('click', () => revelarCarta(carta));
	});

	// Agregar reconocedor de eventos de clic al botón de mezclar
	botonMezclar.addEventListener('click', mezclarCartasRestantes);

	function revelarCarta(carta) {
		contenedorCartasSeleccionadas.innerHTML = '';
		contenedorCartasSeleccionadas.classList.remove('containerPlaceHolder');
		// Quitar la carta seleccionada del grupo restante
		cartasRestantes = cartasRestantes.filter((c) => c !== carta);

		// Obtener el ID de la carta invisible correspondiente
		const idCartaInvisible = carta.getAttribute('data-invisible-card');

		// Ocultar todas las cartas invisibles inicialmente
		cartasInvisibles.forEach((cartaInvisible) => {
			cartaInvisible.classList.add('invisible__carta');
		});

		// Mostrar la carta invisible correspondiente
		const cartaInvisible = document.getElementById(idCartaInvisible);
		cartaInvisible.classList.remove('invisible__carta');

		// Agregar la carta invisible a la lista de las más recientes
		ultimasCartasSeleccionadas.unshift(cartaInvisible);

		// Limitar la lista a un cierto número (opcional)
		const maxVisibleCards = 6; // Puedes ajustar esto según tus necesidades
		ultimasCartasSeleccionadas = ultimasCartasSeleccionadas.slice(0, maxVisibleCards);

		cartaInvisible.classList.add('invisible__carta__post');

		// Mostrar las cartas invisibles seleccionadas en el contenedor
		contenedorCartasSeleccionadas.innerHTML = ''; // Limpiar contenido anterior
		ultimasCartasSeleccionadas.forEach((cartaVisible, index) => {
			const cartaVisibleClon = cartaVisible.cloneNode(true);
			contenedorCartasSeleccionadas.appendChild(cartaVisibleClon);
		});

		// Mover la carta invisible al contenedor de última selección
		contenedorUltimaSeleccion.innerHTML = ''; // Limpiar contenido anterior
		contenedorUltimaSeleccion.appendChild(cartaInvisible);

		// Quitar la carta seleccionada del DOM (eliminarla del pool)
		carta.parentElement.removeChild(carta);
	}
	function mezclarCartasRestantes() {
		// Mezclar solo las cartas restantes
		const cartasRestantesMezcladas = cartasRestantes.sort(() => Math.random() - 0.5);

		// Distribuir las cartas restantes mezcladas entre los contenedores, con un máximo de 5 cartas cada uno
		const contenedores = document.querySelectorAll('.container__superior, .container__inferior, .container__final');

		// Distribuir las cartas de forma aleatoria entre los contenedores
		const cartasPorContenedor = cartasRestantesMezcladas.length / contenedores.length;
		for (let i = 0; i < contenedores.length; i++) {
			const contenedor = contenedores[i];
			contenedor.innerHTML = ''; // Limpiar contenido anterior

			// Obtener un subconjunto aleatorio de cartas para este contenedor
			const cartasEnContenedor = cartasRestantesMezcladas.slice(i * cartasPorContenedor, (i + 1) * cartasPorContenedor);

			// Agregar las cartas al contenedor
			cartasEnContenedor.forEach((carta) => {
				contenedor.appendChild(carta);
			});
		}

		// Ocultar todas las cartas invisibles
		cartasInvisibles.forEach((cartaInvisible) => {
			cartaInvisible.classList.add('invisible__carta');
		});
	}
	function mezclarCartas() {
		// Mezclar todas las cartas inicialmente
		const cartasMezcladas = Array.from(cartas).sort(() => Math.random() - 0.5);

		// Distribuir las cartas mezcladas entre los contenedores, con un máximo de 5 cartas cada uno
		const contenedores = document.querySelectorAll('.container__superior, .container__inferior, .container__final');

		// Distribuir las cartas de forma aleatoria entre los contenedores
		const cartasPorContenedor = cartasMezcladas.length / contenedores.length;
		for (let i = 0; i < contenedores.length; i++) {
			const contenedor = contenedores[i];
			contenedor.innerHTML = ''; // Limpiar contenido anterior

			// Obtener un subconjunto aleatorio de cartas para este contenedor
			const cartasEnContenedor = cartasMezcladas.slice(i * cartasPorContenedor, (i + 1) * cartasPorContenedor);

			// Agregar las cartas al contenedor
			cartasEnContenedor.forEach((carta) => {
				contenedor.appendChild(carta);
			});
		}

		// Ocultar todas las cartas invisibles inicialmente
		cartasInvisibles.forEach((cartaInvisible) => {
			cartaInvisible.classList.add('invisible__carta');
		});
	}
});

function ScrollToReglas() {
	const targetSection3 = document.getElementById('tp__reglas');
	const sectionStart3 = targetSection3.offsetTop;

	// Adjust the scroll position to be a little higher, e.g., subtracting 20 pixels
	const scrollPosition3 = sectionStart3 - 280;

	window.scrollTo({
		top: scrollPosition3,
		behavior: 'smooth',
	});
}

function ScrollToCartas() {
	const targetSection = document.getElementById('tp__cartas');
	const sectionStart = targetSection.offsetTop;

	// Adjust the scroll position to be a little higher, e.g., subtracting 20 pixels
	const scrollPosition = sectionStart - 150;

	window.scrollTo({
		top: scrollPosition,
		behavior: 'smooth',
	});
}
var animateButton = function (e) {
	e.preventDefault();
	var button = e.target;

	// reset animation for all buttons
	var allButtons = document.querySelectorAll('.boton__mezclar, .boton__reiniciar__cartas');
	allButtons.forEach(function (btn) {
		btn.classList.remove('animate');
	});

	// add and remove animation for the clicked button
	button.classList.add('animate');
	setTimeout(function () {
		button.classList.remove('animate');
	}, 700);
};

var bubblyButtons = document.querySelectorAll('.boton__mezclar, .boton__reiniciar__cartas');

for (var i = 0; i < bubblyButtons.length; i++) {
	bubblyButtons[i].addEventListener('click', animateButton, false);
}
