//vamos a requerir las dependencias que hemos instalado en el package.json
const Web3 = require('web3') //para interactuar con la red
const EthereumTx = require('ethereumjs-tx') //para firmar
var xTx     = require('ethereumjs-tx').Transaction
const solc = require('solc') //para compilar
const fs = require('fs') //nos da la gestion de archivos del pc en node.js
const path = require('path');


//instanciar los objetos arriba requeridos
const web3 = new Web3('https://ropsten.infura.io/v3/c5f94f23797c47ecb5fb633740ae8e2f')

//como vamos a trabajar en ropsten vamos a usar las cuentas en ella
const address1 = '0x4AF92bF32A3824641c813013e108e5C1aAD90C3E';//
const addresskey1 = new Buffer.from('201059fbefe95a7e28ceb4955dd3afbe2bf0455bc7473c73649d90ceaf336a22', 'hex');

//ahora vamos a deploy. la cual se hace de una transacc cualquiera, tenemos que Generar el objeto, Firmarlo y Enviarlo al nodo escogido.
//solo que en esta transacc va a incluir :data: y el :to: no se requiere, debe ir omitido o nulo

//vamos a consultar primero la cuenta
console.log('Consulta previa a la Cuenta 1 para verfiicar conexiones:');

web3.eth.getBalance(address1, (err, balance) => {
    console.log(  web3.utils.fromWei(balance, 'ether')  )
})

console.log('*****2');

        //si vamos a requerir de los datos para hacer el deploy del smartcontact de ese campo data dentro del objeto de la transacc, vamos a ncesitar obtener esos datos
        //para ello lo primero que dedemos hacer es compilar
        //con solc vamos compilar, y cuando se compile el contrato obtenderemos 2 campso, ademas de otros, el bytecode y el abi
        //bytecode> es el codigo que hara que se intale el smart contract en la red. 
        //No es codigo como tal. Es un codigo que va a disparar la instalacion del codigo real del smartcontract que se ejecutar aen las proximas transacciones de los usuarios
        //por tanto el bytecode, son datos que se envian a una cuenta 0 en memoria y va a contruir el smartc.
        //abi> es la interfz, es un json, que especifaca todos los metodos del smart contract y las variables con sus parametros y devolcuiones

        //debemos primero leer el archivo .sol
const content = fs.readFileSync('Hola.sol').toString() // en content, en una tira de caracteres hemos guardado el contrato
        //const inboxpath = path.resolve(__dirname, 'Contracts', 'HelloWorld.sol');
        //const source = fs.readFileSync(inboxpath, 'UTF-8');
console.log('*****3');

        //el compilador de solc requiere que le pasemos a la hora de compilar un objeto que especifique cuales van a ser las entradas y las salidas
const objectSolc = {     
     language: 'Solidity',
     sources:{
         'hola': {
             content: content
         }
     },
     settings:{
         outputSelection: {
             '*': {
                 '*': ['*']
             }
         }
     }
 }

 console.log('*****4');  

        //vamos a compilar, cuando se compila vamos a necesitar acceder al abi y al bytecode. La forma mas facil de acceder es con un objeto json
const output = JSON.parse(solc.compile(JSON.stringify(objectSolc) ) )
        //aqui ya tenemos el objeto json el retorno de la compilacion del smartc.

console.log(output);        
console.log('*****5');
        //para obtener el bytecode debemos recorrer el json  









const bytecodeContract = output.contracts.hola.Hola.evm.bytecode.object   
//const bytecodeContract = output.contracts['helloWorld']["bytecode"];
//const bytecodeContract = output.contracts['Token'].bytecode;
// Compile the source code
//const input = fs.readFileSync('HelloWorld.sol');
//const output = solc.compile(input.toString(), 1);
//const bytecode = output.contracts['HelloWorld'].bytecode;
//const abi = JSON.parse(output.contracts['HelloWorld'].interface);









console.log('*****6');
        //todas las trasnacc tienen un nounce incremental, para no dar fallas, debemos envolver la transacc
        //Envolver:
        //esta es la funcion, llamando a nuestro objeto, accediendo al metodo getTransactionCount que nos dice el nounce dec/transacc para la address 
        //si no hay error nos devuelve ese parametro
 web3.eth.getTransactionCount(address1,(err,txCount) =>     {
     let txObject = {
         nonce: web3.utils.toHex(txCount),
         to: null,
         gasLimit: web3.utils.toHex(1000000),
         gasPrice: web3.utils.toHex( web3.utils.toWei('2', 'gwei')),
         data: '0x' + bytecodeContract
     }
    
            //firmamos
            //const tx = new EthereumTx(txObject) 
            //var tx = new EthereumTx(txObject, {'chain':'ropsten'});
     const tx = new xTx(txObject, {'chain':'ropsten'})
     tx.sign(addresskey1)
    
            //serializamos (de un objetos js a uno q se pueda enviar por internet)
     const serializedTx = tx.serialize().toString('hex')

            //enviamos
     web3.eth.sendSignedTransaction('0x' + serializedTx).on('receipt', receipt => {
         console.log('Contrato subido, este es el recibo: ' + receipt.contractAddress)
     })     //escuchador de eventos, en este caso el recibo
 })

console.log('*****f');


        //Contrato subido, este es el recibo: 0xfE7D82Fe1c848af0A020A71143014fF07Fd541f8