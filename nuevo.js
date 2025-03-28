 // Función para mostrar/ocultar el menú desplegable
/*  function toggleDropdown() {
    const filtrar=document.getElementById("filtrar");
    const menu = document.getElementById("dropdown-menu");
    if (menu.style.display === "block") {
        filtrar.innerHTML="Filtrar";
        filtrar.style.border="none";
        menu.style.display = "none";
        filtrar.style.backgroundColor="transparent";
    } else {
        menu.style.display = "block";
        filtrar.innerHTML="cerrar";
        filtrar.style.border="1px solid gray";
        filtrar.style.backgroundColor="rgb(49, 47, 47)";
    }
    
} */

/* const seleccionadas=["agricultura", "farmaceutica", "diagnostico"];  */
/* const seleccionadas=["Empresa", "Instituto", "Grupo de investigación", "Universidad", "Aceleradora", "Incubadora", "Organismos estatales"]; 
 */
/* const seleccionadas=["Empresa", "Instituto", "Grupo de investigación", "Aceleradora", "Incubadora", "Organismos estatales", "Universidad"]; 
 */
const contenedorResultados = document.querySelector("#resultados");
const inputBuscador = document.getElementById("buscador");
const fileNameDisplay = document.getElementById('file-name');
 // captura del contenedor #tooltip para mostrar DATOS DEL ELEMENTO SELECCIONADO
 /* const tooltip=document.querySelector("#tooltip"); */


// para que apenas cargue la página aparezcan TODOS LOS ITEMS seleccionados y se muestren
/* window.onload= recarga(seleccionadas); */





//----------------------------------   FUNCIONES  ---------------------------------------------------

// Función para mostrar las opciones seleccionadas
/* function mostrarSeleccion() {
    
    const checkboxes = document.querySelectorAll("#dropdown-menu input[type='checkbox']:checked");
    const seleccion = Array.from(checkboxes).map(checkbox => checkbox.value); 
    if(seleccion.length > 0){
        recarga(seleccion);
    }else{
        recarga(seleccionadas);
    }
    
    
   toggleDropdown();
  
} */

//--------------------------------------------------------------------------



// Función para eliminar tildes (normalizar texto). Sirve para normalizar texto ingresado por inputs

function quitarTildes(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza y elimina diacríticos
}


//--------------------------------------------------------------------------

//  función para filtrado DINÁMICO (BUSCADOR). 
// Requiere pasarle por parámetros: 
// 1 input capturado desde JS (inputBuscador)
// El array de elementos que serán sujetos a filtrado según lo que ingrese por inputBuscador
 


/* function buscar(inputBuscador, dondeBuscar){

    let resultadoFiltrado = [];  // arreglo donde se agregarán los elementos resultado del filtro
    // Evento para realizar el filtrado
    inputBuscador.addEventListener("input", () => {

        //  ESTILOS DEL BUSCADOR

        if (inputBuscador.value.trim() !== "") {
            inputBuscador.classList.add("buscador-lleno");
        }else{
            inputBuscador.classList.remove("buscador-lleno");
            inputBuscador.classList.add("buscador-vacio");
        }



        const textoBusqueda = quitarTildes(inputBuscador.value.trim().toLowerCase()); // Convertir a minúsculas y eliminar tildes

         
        // Filtrar los elementos del arreglo "filtro"
         resultadoFiltrado = dondeBuscar.filter(item => {
            // Aplica el término de búsqueda en ambas propiedades: label y description
             const coincideLabel = quitarTildes(item.Label.toLowerCase()).includes(textoBusqueda.toLowerCase()); 
            const coincideDescription = quitarTildes(item.Description.toLowerCase()).includes(textoBusqueda.toLowerCase());
            
            // Retorna verdadero si el término está en al menos una de las propiedades y 
            // agrega ese elemento al array resultadoFiltrado
            return  coincideLabel ||  coincideDescription;
          });
         
    
           
    
           

      

        //  llamo función para MOSTRAR LOS RESULTADOS

            imprimirHtmlResultados(resultadoFiltrado);  

        });

        
        
} */



function buscar(inputBuscador, dondeBuscar) {
    let resultadoFiltrado = [];
    inputBuscador.addEventListener("input", () => {
        if (inputBuscador.value.trim() !== "") {
        inputBuscador.classList.add("buscador-lleno");
        
        } else {
        inputBuscador.classList.remove("buscador-lleno");
        
        inputBuscador.classList.add("buscador-vacio");
        }

        // Dividir el texto ingresado en palabras separadas
        const palabrasBusqueda = quitarTildes(inputBuscador.value.trim().toLowerCase())
                                .split(/\s+/)
                                .filter(palabra => palabra.length > 0); // Filtrar palabras vacías

        resultadoFiltrado = dondeBuscar.filter(item => {
        const descriptionLower = quitarTildes(item.Description.toLowerCase());

        // Verificar que todas las palabras coincidan en Description
        const coincideDescription = palabrasBusqueda.every(palabra => descriptionLower.includes(palabra));

        if (coincideDescription) {
            // Generar una porción relevante de texto para cada término de búsqueda
            item.HighlightedDescription = palabrasBusqueda
            .map(palabra => extractContext(descriptionLower, palabra, item.Description))
            .join("...");
        }

        return coincideDescription; // Mostrar solo si todas las palabras coinciden
        });

        imprimirResultados(resultadoFiltrado);
    });
}

function extractContext(texto, busqueda, originalTexto) {
    // Encontrar la posición del término en el texto y extraer el contexto
    const index = texto.indexOf(busqueda);
    if (index === -1) return ""; // Retornar vacío si no hay coincidencia
    const contextLength = 20; // Cantidad de caracteres alrededor del término
    const start = Math.max(0, index - contextLength);
    const end = Math.min(texto.length, index + busqueda.length + contextLength);
    return originalTexto.substring(start, end); // Extraer texto original alrededor de la coincidencia
}





function resaltarTexto(texto, busqueda) {
    if (!busqueda || busqueda.trim().length === 0) return texto; // Retorna el texto sin cambios si no hay búsqueda

    // Dividir el término de búsqueda en palabras separadas
    const palabras = quitarTildes(busqueda.trim().toLowerCase()).split(/\s+/).filter(palabra => palabra.length > 0);

    // Escapar caracteres especiales en las palabras
    const escaparRegex = palabra => palabra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Crear una expresión regular incluyendo todas las palabras
    const regex = new RegExp(`(${palabras.map(escaparRegex).join("|")})`, "gi");

    // Reemplazar todas las coincidencias en el texto con la etiqueta <mark>
    return texto.replace(regex, "<mark>$1</mark>");
}
          








function imprimirResultados(resultadoFiltrado) {
    contenedorResultados.innerHTML = ""; // Limpiar el contenedor

    contenedorResultados.classList.add("bg-display");

        resultadoFiltrado.forEach(item => {
            const h3 = document.createElement("h3");
            const h4 = document.createElement("h4");
            h3.innerHTML = `${item.Label}`;
            h4.innerHTML = resaltarTexto(item.HighlightedDescription || item.Description, inputBuscador.value);
            contenedorResultados.appendChild(h3);
            contenedorResultados.appendChild(h4);
        

            h3.addEventListener("click", () => {
                tooltip.innerHTML = `
                <h3>${item.Label}</h3>
                <h4>${item.Type}</h4>
                <h4>${resaltarTexto(item.Description, inputBuscador.value)}</h4>
                <p class="web-link">
                    <a class="a" href="${item.web || item.url}" target="_blank">website</a>
                </p>
                `;
                tooltip.style.backgroundColor = "rgb(23, 23, 23)",
                tooltip.style.boxShadow = "inset -3px -20px 1.5rem rgb(93, 91, 91)";

            });
    });
}






















/* 

        function buscar(inputBuscador, dondeBuscar) {
            let resultadoFiltrado = [];
            inputBuscador.addEventListener("input", () => {
              if (inputBuscador.value.trim() !== "") {
                inputBuscador.classList.add("buscador-lleno");
              } else {
                inputBuscador.classList.remove("buscador-lleno");
                inputBuscador.classList.add("buscador-vacio");
              }
          
              // Dividir el texto ingresado en palabras separadas
              const palabrasBusqueda = quitarTildes(inputBuscador.value.trim().toLowerCase())
                                        .split(/\s+/)
                                        .filter(palabra => palabra.length > 0); // Filtrar palabras vacías
          
              resultadoFiltrado = dondeBuscar.filter(item => {
                const descriptionLower = quitarTildes(item.Description.toLowerCase());
          
                // Verificar que todas las palabras coincidan en Description
                const coincideDescription = palabrasBusqueda.every(palabra => descriptionLower.includes(palabra));
          
                if (coincideDescription) {
                  item.HighlightedDescription = palabrasBusqueda.map(palabra => extractContext(descriptionLower, palabra, item.Description)).join("...");
                }
          
                return coincideDescription; // Mostrar solo si todas las palabras coinciden
              });
          
              imprimirResultados(resultadoFiltrado);
            });
          }
          
          function extractContext(texto, busqueda, originalTexto) {
            const index = texto.indexOf(busqueda);
            if (index === -1) return "";
            const contextLength = 20; // Cantidad de caracteres alrededor del término
            const start = Math.max(0, index - contextLength);
            const end = Math.min(texto.length, index + busqueda.length + contextLength);
            return originalTexto.substring(start, end); // Extrae texto original alrededor de la coincidencia
          }
          
          function imprimirResultados(resultadoFiltrado) {
            contenedorResultados.innerHTML = ""; // Limpiar el contenedor
          
            resultadoFiltrado.forEach(item => {
              const h3 = document.createElement("h3");
              const h4 = document.createElement("h4");
              h3.innerHTML = `${item.Label}`;
              h4.innerHTML = resaltarTexto(item.HighlightedDescription || item.Description, inputBuscador.value);
              contenedorResultados.appendChild(h3);
              contenedorResultados.appendChild(h4);
          

              h3.addEventListener("click", () => {
                tooltip.innerHTML = `
                  <h3>${item.Label}</h3>
                  <h4>${item.Type}</h4>
                  <h4>${resaltarTexto(item.Description, inputBuscador.value)}</h4>
                  <p class="web-link">
                    <a class="a" href="${item.web || item.url}" target="_blank">website</a>
                  </p>
                `;
                tooltip.style.backgroundColor = "rgb(80, 80, 80)";
              });
            });
          }
          




          function resaltarTexto(texto, busqueda) {
            if (!busqueda || busqueda.trim().length === 0) return texto; // Retorna el texto sin cambios si no hay búsqueda
          
            // Dividir el término de búsqueda en palabras separadas
            const palabras = quitarTildes(busqueda.trim().toLowerCase()).split(/\s+/).filter(palabra => palabra.length > 0);
          
            // Escapar caracteres especiales en las palabras
            const escaparRegex = palabra => palabra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          
            // Crear una expresión regular incluyendo todas las palabras
            const regex = new RegExp(`(${palabras.map(escaparRegex).join("|")})`, "gi");
          
            // Reemplazar todas las coincidencias en el texto con la etiqueta <mark>
            return texto.replace(regex, "<mark>$1</mark>");
          } */
          

//--------------------------------------------------------------------------

//  función para MOSTRAR los resultados del filtrado en el HTML

// Previamente hay que tener capturados el contenedor donde se mostrarán los resultados (contenedorResultados)
// y el contenedor donde se mostrarán los detalles del item (tooltip)


// Requiere pasarle por PARÁMETRO el ARRAY resultado del filtrado (resultadoFiltrado)


/* 
function imprimirHtmlResultados(resultadoFiltrado){
   
    // Limpiar el contenedor y mostrar los resultados filtrados
     contenedorResultados.innerHTML = "";

     
        resultadoFiltrado.forEach(item => {
            const h3 = document.createElement("h3");  
            h3.textContent = item.Label;
      
            const h4 = document.createElement("h4"); //crea un h3 para cada resultado
            h4.textContent = item.Description.substring(0, 70); 
           
            contenedorResultados.appendChild(h3);
            contenedorResultados.appendChild(h4); 
   

          // Agrega un evento click al h3
            h3.addEventListener("click", () => {


                if(item.web !="" | item.url !=""){
                    tooltip.innerHTML= `
                        <h3>${item.Label}</h3><br>
                        <h4>${item.Type}</h4>
                        <h4>${item.Description}</h4>
                        <p class="web-link">
                            <a class="a" href="${item.web} ${item.url}" target="_blank">website</a>
                        </p> 
                    `;
                }else{
                    tooltip.innerHTML= `
                        <h3>${item.Label}</h3><br>
                        <h4>${item.Type}</h4>
                        <h4>${item.Description}</h4>
                        
                       `;
                }
       
                tooltip.style.backgroundColor= "rgb(80, 80, 80)"; 
            });   
        
   
            
            
       
     }); 
    }
 */



//--------------------------------------------------------------------------
function extraerDatos(data){

  /*   d3.json(userJSON).then(function(data){ */
   
        //  llamo función "buscar" para que busque cada caracter ingresado dentro de la base de datos   
        buscar(inputBuscador, data);

    //-------------------------------------------------------------------

        // IMPRESIÓN DE CANTIDAD DE RESULTADOS LUEGO DEL FILTRADO

    /*  const cantidadResultados=document.querySelector("#cantidad-resultados"); 

    
        
        let htmlCantidad=`${filtro.length} resultados`;
        
        cantidadResultados.innerHTML= htmlCantidad;
        */
    //----------------------------------------------------------------------------
        
        // llamo "imprimirResultados"
    /* 
        imprimirResultados(filtro);  */

   /*  }); */
}
//--------------------------------------------------------------------------



const fileInput = document.getElementById('fileInput'),
labelJson = document.getElementById("label-json"),
reloadBtn = document.getElementById("reload-btn");


fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const userJSON = JSON.parse(e.target.result);
            extraerDatos(userJSON); 
           
            labelJson.textContent = file.name; 
            labelJson.classList.add("disabled");
            labelJson.classList.remove("label-file");
            fileInput.disabled = true; // Desactiva el input type = file

            reloadBtn.classList.add("visible");
            
            reloadBtn.addEventListener("click", function(){
                location.reload();
            })
            
        } catch (error) {
            console.error('Error:', error);
            alert('Por favor carga un archivo JSON válido.');
        }
    };

    reader.readAsText(file);

    
});






// Añadir el manejador de eventos `wheel` con la opción pasiva para evitar el error de rendimiento
document.addEventListener("wheel", function(e) {
// Tu código aquí, si es necesario
}, { passive: true });




