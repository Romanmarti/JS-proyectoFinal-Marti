    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let usuarioActual = null;

    // Cargar los archivos JSON de ejercicios y calentamiento
    Promise.all([
        fetch('../ejercicios.json').then(response => response.json()),
        fetch('../calentamiento.json').then(response => response.json())
        .catch(error => console.error("Error al cargar datos:", error))
    ])
    .then(([ejercicios, calentamiento]) => {

        const gruposMusculares = ['pecho', 'biceps', 'triceps', 'hombros', 'espalda', 'piernas', 'abdomen'];
        let numeroDias = 0;
    // Uso de librería (SweetAlert2)
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
  });
  
  // Registro de usuario
  document.getElementById('registro').addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  

      if (usuarios.some(usuario => usuario.username === username)) {
          // Muestra alerta con SweetAlert2 Toast
          Toast.fire({
              icon: 'error',
              title: 'El usuario ya está registrado.'
          });
          return;
      }
  
      // Agregar el nuevo usuario
      usuarios.push({ username, password, historial: [] });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
  
      // Muestra
      Toast.fire({
          icon: 'success',
          title: 'Registro exitoso. Ahora puedes iniciar sesión.'
      });
  
      document.getElementById('registroForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
  });
  
  // Inicio de sesión
  document.getElementById('login').addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
  

      usuarioActual = usuarios.find(usuario => usuario.username === username && usuario.password === password);
      if (usuarioActual) {
          // Muestra alerta con SweetAlert2 Toast
          Toast.fire({
              icon: 'success',
              title: 'Has iniciado sesión exitosamente.'
          });
  
          document.getElementById('loginForm').style.display = 'none';
          document.getElementById('registroForm').style.display = 'none';
          document.getElementById('contenido').style.display = 'block';
          document.getElementById('usuarioNombre').innerText = usuarioActual.username;
          cargarHistorial();  
      } else {
          // Muestra alerta con SweetAlert2 Toast
          Toast.fire({
              icon: 'error',
              title: 'Credenciales incorrectas.'
          });
      }
  });
  

        // Cerrar sesión
        document.getElementById('logoutButton').addEventListener('click', function() {
            usuarioActual = null;
            document.getElementById('contenido').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registroForm').style.display = 'none';
        });


        document.getElementById('dias').addEventListener('input', function () {
            numeroDias = parseInt(document.getElementById('dias').value);
            let diasSeleccionadosDiv = document.getElementById('diasSeleccionados');
            diasSeleccionadosDiv.innerHTML = '';  

            for (let i = 1; i <= numeroDias; i++) {
                let diaDiv = document.createElement('div');
                diaDiv.innerHTML = `
                    <h3>Día ${i}</h3>
                    <label for="grupo-${i}-1">Grupo muscular 1</label>
                    <select name="grupo-${i}-1" id="grupo-${i}-1">
                        ${gruposMusculares.map(grupo => `<option value="${grupo}">${grupo.charAt(0).toUpperCase() + grupo.slice(1)}</option>`).join('')}
                    </select>
                    <label for="grupo-${i}-2">Grupo muscular 2</label>
                    <select name="grupo-${i}-2" id="grupo-${i}-2">
                        ${gruposMusculares.map(grupo => `<option value="${grupo}">${grupo.charAt(0).toUpperCase() + grupo.slice(1)}</option>`).join('')}
                    </select>
                    <label for="grupo-${i}-3">Grupo muscular opcional (opcional)</label>
                    <select name="grupo-${i}-3" id="grupo-${i}-3">
                        <option value="">Ninguno</option>
                        ${gruposMusculares.map(grupo => `<option value="${grupo}">${grupo.charAt(0).toUpperCase() + grupo.slice(1)}</option>`).join('')}
                    </select>
                `;
                diasSeleccionadosDiv.appendChild(diaDiv);
            }
        });
// Mostrar la rutina generada después de enviar el formulario
document.getElementById('rutinaForm').addEventListener('submit', function (event) {
    event.preventDefault();
    mostrarRutina(ejercicios, calentamiento);  // Llama a la función para mostrar la rutina
    mostrarAlerta(); 
});

const loader = document.getElementById('loader');

function mostrarRutina(ejercicios, calentamiento) {
    let diasEntreno = [];


    for (let i = 1; i <= numeroDias; i++) {
        let gruposDia = [];
        for (let j = 1; j <= 3; j++) {
            let grupo = document.querySelector(`[name="grupo-${i}-${j}"]`).value;
            if (grupo) {
                gruposDia.push(grupo);
            }
        }
        diasEntreno.push(gruposDia);
    }

    let resultado = document.getElementById('resultado');
    resultado.innerHTML = ''; 

    diasEntreno.forEach((dia, index) => {
        let diaTitulo = document.createElement('h3');
        diaTitulo.innerText = `Día ${index + 1}`;
        resultado.appendChild(diaTitulo);

        dia.forEach(grupo => {
            let grupoTitulo = document.createElement('h4');
            grupoTitulo.innerText = `${grupo.charAt(0).toUpperCase() + grupo.slice(1)}:`;
            resultado.appendChild(grupoTitulo);

            // Mostrar los calentamientos
            if (calentamiento[grupo] && calentamiento[grupo].calentamiento) {
                let calentamientoTitulo = document.createElement('h5');
                calentamientoTitulo.innerText = "Calentamiento:";
                resultado.appendChild(calentamientoTitulo);
                calentamiento[grupo].calentamiento.forEach(ejercicio => {
                    let ejercicioElemento = document.createElement('p');
                    ejercicioElemento.innerText = `${ejercicio.nombre} - ${ejercicio.descripcion}`;
                    resultado.appendChild(ejercicioElemento);
                });
            }

            // Mostrar los ejercicios principales
            if (ejercicios[grupo]) {
                let ejerciciosTitulo = document.createElement('h5');
                ejerciciosTitulo.innerText = "Ejercicios:";
                resultado.appendChild(ejerciciosTitulo);
                ejercicios[grupo].forEach(ejercicio => {
                    let ejercicioElemento = document.createElement('p');
                    ejercicioElemento.innerText = `${ejercicio.nombre} - ${ejercicio.descripcion} - ${ejercicio.series} series de ${ejercicio.repeticiones} repeticiones`;
                    resultado.appendChild(ejercicioElemento);
                });
            }

            // Mostrar los estiramientos
            if (calentamiento[grupo] && calentamiento[grupo].estiramientos) {
                let estiramientoTitulo = document.createElement('h5');
                estiramientoTitulo.innerText = "Estiramientos:";
                resultado.appendChild(estiramientoTitulo);
                calentamiento[grupo].estiramientos.forEach(ejercicio => {
                    let ejercicioElemento = document.createElement('p');
                    ejercicioElemento.innerText = `${ejercicio.nombre} - ${ejercicio.descripcion}`;
                    resultado.appendChild(ejercicioElemento);
                });
            }
        });
    });
}

// Uso de librería (SweetAlert2)
function mostrarAlerta() {
    Swal.fire({
        title: "Rutina Generada!",
        text: "Aquí tienes tu rutina de entrenamiento personalizada.",
        imageUrl: "assets/images/imagen.jfif", 
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Imagen de la rutina",
        confirmButtonText: "¡Entendido!"
    });
}

                // Guardado de historial
            usuarioActual.historial.push({
                fecha: new Date().toLocaleString(),
                diasEntreno: diasEntreno
            });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            cargarHistorial();
        

        function cargarHistorial() {
            const historialDiv = document.getElementById('historial');
            historialDiv.innerHTML = '<h2>Historial de entrenamientos</h2>';

            if (!usuarioActual.historial || usuarioActual.historial.length === 0) {
                historialDiv.innerHTML += '<p>No hay entrenamientos registrados.</p>';
                return;
            }

            usuarioActual.historial.forEach((entrenamiento, index) => {
                let entrenamientoDiv = document.createElement('div');
                entrenamientoDiv.classList.add('entrenamiento'); 

                let fechaEntrenamiento = new Date(entrenamiento.fecha).toLocaleString();

                entrenamientoDiv.innerHTML = `
                    <h3>Entrenamiento ${index + 1} - <span class="fecha">${fechaEntrenamiento}</span></h3>
                `;

                entrenamiento.diasEntreno.forEach((dia, diaIndex) => {
                    let diaDiv = document.createElement('div');
                    diaDiv.classList.add('dia');

                    diaDiv.innerHTML = `<h4>Día ${diaIndex + 1}:</h4>`; 

                    dia.forEach(grupo => {
                        let grupoDiv = document.createElement('div');
                        grupoDiv.classList.add('grupo');

                        grupoDiv.innerHTML = `
                            <strong>${grupo.charAt(0).toUpperCase() + grupo.slice(1)}</strong>
                        `;

                        diaDiv.appendChild(grupoDiv);
                    });

                    entrenamientoDiv.appendChild(diaDiv);
                });

                historialDiv.appendChild(entrenamientoDiv);
            });
        }
    });
        fetch('dieta.json')
        .then(response => response.json())
        .then(dietas => {
            function mostrarDieta(meta) {
            const dieta = dietas[meta];

            if (dieta) {
                const resultadoDieta = document.getElementById('resultadoDieta');
                resultadoDieta.innerHTML = '';

                Object.keys(dieta).forEach(comida => {
                const comidaDiv = document.createElement('div');
                comidaDiv.classList.add('comida');

                const tituloComida = document.createElement('h3');
                tituloComida.innerText = comida.charAt(0).toUpperCase() + comida.slice(1);
                comidaDiv.appendChild(tituloComida);

                dieta[comida].forEach(plato => {
                    const platoElemento = document.createElement('p');
                    platoElemento.innerText = plato;
                    comidaDiv.appendChild(platoElemento);
                });

                resultadoDieta.appendChild(comidaDiv);
                });
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Credenciales incorrectas.'
                });
            }
            }


            document.getElementById('seleccionarMeta').addEventListener('change', function() {
            const meta = this.value;
            mostrarDieta(meta); // Muestra de dieta
            });
        })
        .catch(error => console.error("Error al cargar el archivo de dieta:", error));
