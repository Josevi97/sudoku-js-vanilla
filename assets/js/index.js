// Declaro el tamaño de la tabla: 9x9 en este caso
const TABLE_SIZE = {
	width: 9,
	height: 9,
};

// Declaro cada cuantos elementos se tendra en cuenta para aplicar un
// borde extra dentro de la tabla (rejilla que resalta los grupos)
const SEPARATOR_VALUE = 3;

// Cuando la pagina se carga se generan tanto la tabla como las celdas que
// contendran valores aleatorios
document.addEventListener('DOMContentLoaded', () => {
	generateTable();
	generateRandomCells();
});

// Cada vez que se detecta un cambio en un input (casilla donde puedes escribir)
// se comprueba si se trata de un numero entre 1 y 9 y si el numero dado es
// valido. De no pasar este filtro, se vacia el input
document.addEventListener('change', (e) => {
	e.target.classList.remove('success__animation');
	e.target.classList.remove('error__animation');

	setTimeout(() => {
		if (
			!e.target.value.match('^[1-9]$') ||
			!checkNumber(e.target.value, e.target.classList)
		) {
			e.target.value = '';
			e.target.classList.add('error__animation');
			return;
		}

		e.target.blur();
		e.target.classList.add('success__animation');
	}, 100);
});

// Añade el evento on click al boton de la alerta, para que cuando se haga
// click, se reinicie la partida
document.getElementById('alert__button').addEventListener('click', () => {
	document.getElementById('alert').classList.add('invisible');

	generateTable();
	generateRandomCells();
});

// Genera la tabla y aplica ciertos identificadores tanto de id como de
// clases que se utilizaran en la logica para comprobar si los numeros son
// validos
const generateTable = () => {
	const tbody = document.getElementById('table__content');
	let table_content = '';
	let indexX = 1;
	let indexY = 1;

	tbody.innerHTML = '';

	for (let y = 0; y < TABLE_SIZE.height; y++) {
		const td_class_bottom =
			y == SEPARATOR_VALUE * indexY - 1 && indexY < SEPARATOR_VALUE
				? 'section_bottom'
				: '';

		table_content += '<tr>';
		indexX = 1;

		for (let x = 0; x < TABLE_SIZE.width; x++) {
			const row = `row${y}`;
			const col = `col${x}`;
			const groupX = `groupX${indexX}`;
			const groupY = `groupY${indexY}`;
			const td_class_right =
				x == SEPARATOR_VALUE * indexX - 1 && indexX < SEPARATOR_VALUE
					? 'section_right'
					: '';

			table_content += `
                <td class="${td_class_right} ${td_class_bottom}"> 
                    <input 
                    id="${col}-${row}" 
                    class="${col} ${row} ${groupX} ${groupY}"
                    type="text" />
                </td>`;
			indexX = td_class_right ? indexX + 1 : indexX;
		}

		table_content += '</tr>';
		indexY = td_class_bottom ? indexY + 1 : indexY;
	}

	tbody.innerHTML = table_content;
};

// Se generan celdas aleatorias que contendran un valor por defecto.
// Ademas, aplica un estado por defecto para resaltar las celdas en la tabla
// como aquellas celdas que sus valores se generaron automaticamente
const generateRandomCells = () => {
	const inputs = document.getElementsByTagName('input');
	const max = inputs.length / 3;
	const min = max - max / 3;
	const times = Math.floor(Math.random() * (max - min) + min);

	let data = Array.prototype.slice.call(inputs);

	for (let i = 0; i < times; i++) {
		const random = Math.floor(Math.random() * data.length);
		const td = data[random];
		data = data.filter((d, index) => random != index);
		td.classList.add('random');
		td.value = generateRandomValue(td);
		td.readOnly = true;
	}
};

// Genera valores aleatorios dado un grupo de clases. Clases que se utilizan
// para que la funcion checkNumber compruebe para cada una de las clases, si
// el numero aleatorio seria valido
const generateRandomValue = (td) => {
	while (true) {
		const random = Math.floor(Math.random() * 9 + 1);

		if (checkNumber(random, td.classList, true)) {
			return random;
		}
	}
};

// Comprueba si un numero dado es valido en base a un grupo de clases que
// se utilizan para poder identificar un grupo al que pertenece una celda.
// Es decir, comprueba si para una celda dada, en base a su columna, fila y
// grupo, el numero seria valido
const checkNumber = (number, classes, auto) => {
	classes = [classes[0], classes[1], `${classes[2]} ${classes[3]}`];

	for (let i = 0; i < classes.length; i++) {
		const data = Array.prototype.slice.call(
			document.getElementsByClassName(classes[i])
		);

		if (
			data.filter((d) => parseInt(d.value) === parseInt(number)).length >
			(auto ? 0 : 1)
		) {
			return false;
		}
	}

	return true;
};

// Comprueba si hay victoria en base al texto que contienen los inputs:
// si todos los inputs tienen texto, significa que has ganado
const checkVictory = () => {
	const data = Array.prototype.slice.call(
		document.getElementsByTagName('input')
	);

	if (data.filter((d) => d.value === '').length === 0)
		document.getElementById('alert').classList.remove('invisible');
};
