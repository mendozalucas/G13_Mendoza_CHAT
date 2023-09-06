let cubos = document.querySelectorAll('.Cuadrado');
console.log( "cubos "+cubos)
cubos =[...cubos];


cubos.forEach(element =>{
   element.addEventListener('input', event =>{
    if(event.target.nextElementSibling){
        event.target.nextElementSibling.focus();
    }
   })
})
