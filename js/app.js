const resultado =document.querySelector('#resultado');
const formulario= document.querySelector('#formulario');
const paginacionDiv= document.querySelector('#paginacion');
let totalPaginas;
let interador;
let paginaActual=1;
const registroPorpagina= 40;


window.onload=()=>{

    formulario.addEventListener('submit', validarFormulario);
}


function validarFormulario(e){
    const terminoBusqueda=document.querySelector('#termino').value;

    e.preventDefault();

    if(terminoBusqueda === ''){
        mostrarAlerta('agregar un termino de busqueda');
        return;
    }

    buscarImagenes();

}

function mostrarAlerta(mensaje){
    const existeAlerta= document.querySelector('.bg-red-100');
    if(!existeAlerta){
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-4', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML=`
            <strong class="font-bold "> Error!   </strong>
            <span class="block sm:inline ">  ${mensaje}</span>

        `;

        formulario.appendChild(alerta);

        setTimeout(()=>{
        alerta.remove();

        },2000)
    }   


}

function buscarImagenes(){
    const termino=document.querySelector('#termino').value;
const key='38085640-81dec4ed2f3a5c3b81afe590f';
const url=`https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorpagina}&page=${paginaActual}`;

fetch(url)
.then(resultado => resultado.json())
    .then(data=>{
        
        totalPaginas = calcularPagina(data.totalHits);
        mostrarImagen(data.hits);
        console.log(totalPaginas);

    })

    
}

function mostrarImagen(imagenes){
    limpiarHtml();
    //console.log(imagenes);

    //agregar imagenes
    imagenes.forEach(imagen => {
        const {previewURL,likes, views, largeImageURL}=imagen;
        resultado.innerHTML +=` 
        
        <div class=" w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">
                     
                <div class="p-4">
                <p class="font-bold" > ${likes} <span class="font-light"> Me gustas </span> </p>
                <p class="font-bold" > ${views} <span class="font-light"> Veces Vistas </span> </p>


                <a class=" block w-full bg-blue-800 hover:bg-blue-500 text-vhite uppercase font-bold text-center rounded mt-5 p-1"
                href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                    Ver Imagen
                </a>
                </div>


            </div>
        
          
        </div>
        
        `;
    });
    
    //limpiar paginacion previa

    while(paginacionDiv.firstChild){

        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    //generar htmal

    imprimirPaginador();
    

}
//hacer un generador para la paginacion
function *crearPaginacion(total){
    
    console.log('si entro ' ,total);
   
     for(let i=0; i<=total; i++){
        yield i;

     }
     

}

function calcularPagina(total){
    return parseInt(Math.ceil(total/registroPorpagina));
}

function limpiarHtml(){

   while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
   }
}

function imprimirPaginador(){
    
    
    interador= crearPaginacion(totalPaginas);

   console.log('nojoda',interador.next().value); 
    while(true){
        const{value, done}=interador.next();

        if(done) return;

        //caso contrario se generara un poton por cada elemento del generador;
        const boton= document.createElement('a');
        boton.href='#';
        boton.dataset.pagina= value;
        boton.textContent= value;
        boton.classList.add('sigiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'uppercase', 'rounded');

        paginacionDiv.appendChild(boton);   
        boton.onclick= ()=>{

            buscarImagenes();
            paginaActual=value;
            console.log(paginaActual);
        }
    }
}



