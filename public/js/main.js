const numeroIngresado = document.getElementById('numero'),
      textoIngresado = document.getElementById('msg'),
      boton = document.getElementById('boton') ,
      respuesta = document.querySelector('.respuesta')

boton.addEventListener('click',send,false)

const socket = io()
socket.on('smsStatus', function(data) {
    respuesta.innerHTML = '<h5>Mensaje enviado a '+ data.number + '</h5>'
    console.log(respuesta.innerHTML)

})

function send() {
    const numero = numeroIngresado.value.replace(/\D/g, ''),
          texto = textoIngresado.value

    fetch('/',{
        method: 'POST',
        headers: {
        'Content-type': 'application/json'
        },
    body: JSON.stringify({numero: numero, texto: texto})
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
}