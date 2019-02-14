const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const Nexmo = require('nexmo')
const socketio = require('socket.io')

//Iniciar nexmo
const nexmo = new Nexmo({
    apiKey: '57acff0c',
    apiSecret: '6ae5dc2992056a55'
},{debug: true})

//Iniciar app
const app = express()

//Configuracion de plantilla
app.set('view engine', 'html')
app.engine('html',ejs.renderFile)

//Configuracion de carpetas publicas
app.use(express.static(__dirname + '/public'))

//Middleware del cuerpo
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Definir puerto
const port = 3000

//Index route
app.get('/', (req,res) => {
    res.render('index')
})

//Llamada al formulario
app.post('/', (req,res) => {
   res.send(req.body)
   console.log(req.body.numero)
   const numero = req.body.numero
   const texto = req.body.texto

   nexmo.message.sendSms(
    'yourphonenumber', numero, texto, {type:'unicode'},
    (err, responseData) => {
        if(err){
            console.log(err)
        }else{
            console.dir(responseData)
            const data = {
                id: responseData.messages[0]['message-id'],
                number: responseData.messages[0]['to']
            }
            //Emitir al cliente
            io.emit('smsStatus', data)
        }
    }
   )
})

//Iniciar servidor
const server = app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`))


//Conectar con socket.io
const io = socketio(server)
io.on('connection' , (socket) => {
    console.log('Conectado')
io.on('disconnect', () =>
    console.log('Desconectado') )
})
