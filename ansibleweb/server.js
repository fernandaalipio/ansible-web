const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require("body-parser"); // módulo para coletar informações do formulário
const https = require('https');

app.set('view engine', 'ejs');
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use('/assets', express.static(__dirname + '/assets/'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.raw({type: 'string'})); //

var pkginfo = require('pkginfo')(module);
var pkg = module.exports;
app.use(bodyParser.json());

app.post('/add', function (req, res,) { //coletando informações do formulario e postando na API



     var options = {
        hostname: '192.168.100.12',
        port: 443, // porta para se adequar ao protocolo HTTPS
        path: '/api/v2/job_templates/8/launch/',
        method: 'POST',
        json: true,
        type: 'string',
        responseType: 'buffer',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer kkLVSchUHiwKnBMjHPgGQQRd0qsUz7', // autenticação no Tower
        },
        encoding: null, //  if you expect binary data
        body: new Uint8Array(0),
        rejectUnauthorized: false,
        requestCert: true,
        agent: false

    };

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    var conect = https.request(options, function (res) {  //https request para conectar com o Tower
        console.log('status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log('Body: ' + body);
        });
    });
    conect.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    //construindo objeto para ser postado
    const obj = {
        extra_vars: {
            vm_custom_name: req.body.vm_custom_name,
            num_vms: parseFloat(req.body.num_vms),
            enviroment: req.body.enviroment,
            vm_cpus: parseFloat(req.body.vm_cpus),
            vm_memory: parseFloat(req.body.vm_memory),
            vm_disk: parseFloat(req.body.vm_disk),
            vm_net: '192.168.100.0',
            inventory_tower: req.body.inventory_tower
        }
    };

    //transformando objeto em JSON
    const objstring =JSON.stringify(obj);

    //teste para imprimir JSON no console
    console.log(objstring);

    // Escrevendo no body de onde vai postar
    conect.write(objstring);
    conect.end();
});

router.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + '/about.html'));
}),

router.get('/sitemap', function (req, res) {
    res.sendFile(path.join(__dirname + '/sitemap.html'));
});

router.get('/', function (req, res,) {
    res.render('index', {'pkginfo' : pkg});

});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');

