var _divVeryMatch_BOX = "verymatch_box";
var _divVeryMatch_INNER_BOX = "verymatch_inner_box";
var _divVeryMatch_IMAGEN = "verymatch_imagen";
var _divVeryMatch_PALABRA = "divVeryMatch_Palabra";
var _divVeryMatch_SIGNIFICADO = "divVeryMatch_Significado";
var _divVeryMatch_SESSION = "verymatch_SESION"
var _aVeryMatch_BOTON_AGREGAR = "verymatch_Boton_Agregear"
var _iframeVeryMatch_Palabra = "verymatch_iframePalabra"
var _divVeryMatch_Mensaje = "VeryMatch_divMensaje";
var _altoVMBoxSoloPalabra = 87;
var _altoDiferenciaBox = 50;

//var _URL_HOST = "http://localhost:31222/";
var _URL_HOST = "http://localhost:3000/";

var _URL_VERYMATCH = _URL_HOST + "template/";
var _URL_LOGIN_VERYMATCH = _URL_HOST + "";
//var _URL_TRADUCCION_VERYMATCH = _URL_HOST + "Servicio/Palabra/traduccion.aspx?qs=";
var _URL_TRADUCCION_VERYMATCH = "chrome-extension://id_chrome/verypop.html?qs=";

var _popUpAbierto = false;
var _imagenAbierta = false;
//var _directorioBase = "chrome-extension://ID_CHROME";
var _directorioBase = "chrome-extension://ID_CHROME/";

var _very = { 'template': null, 'usuario': '', 'palabraSeleccionada': '', 'significado': '', 'significadoAnterior': '', 'palabraEsTexto': false, 'puedeAgregar': false, 'id_browser':'' };

_cargarTemplate();

//*********** Constantes VeryMatch Box

var _style_img_cerrar = "cursor:pointer;float: right;padding-right: 10px;padding-top: 12px;";
var _style_vm_header = "margin: 0px; padding: 0px; border-width: 0px 0px 1px; border-bottom-style: solid; border-bottom-color: rgb(186, 186, 186); font-family: inherit; font-size: 14px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; line-height: 44px; vertical-align: baseline; height: 44px; box-shadow: rgb(255, 255, 255) 0px -1px 0px inset, rgba(0, 0, 0, 0.0784314) 0px 1px 3px; border-radius: 4px 4px 0px 0px; text-align: center; color: rgb(68, 68, 68); text-shadow: rgb(255, 255, 255) 0px 1px 0px; width: 100%; background-image: -webkit-linear-gradient(top, rgb(249, 249, 249), rgb(233, 233, 233))";
var _style_vm_box = "height: 250px; width: 404px; background: white;";
//***********

function _inicio()
{
    _very.id_browser = chrome.runtime.id.trim();
    _crearPopUp();
    // _configurarBotones();
    // _validarEntrada();
}
function _validarEntrada()
{
    document.getElementById("VeryMatch_txtSignificado").onkeypress = function (e) {
        var chr = String.fromCharCode(e.which);
        if ("ABCDEFGHIJKLMNOPQRSTVWXYZabcdefghijklmnopqrstvwxyzáéíóúúü ".indexOf(chr) < 0)
            return false;
    };
}

function _desplegarElementosSignificado(idocument)
{
    var _lblSignificado = idocument.getElementById("VeryMatch_lblSignificado");
    var _txtSignificado = idocument.getElementById("VeryMatch_txtSignificado");
    var _lblTextoSignificado = idocument.getElementById("VeryMatch_lblTituloSignificado");
    var _lblTextoPalabra = idocument.getElementById("VeryMatch_lblTituloPalabra");

    if (_very.usuario.length == 0)
    {
        _txtSignificado.style.display = 'none';
        _lblSignificado.style.display = 'inline-block';
        _lblTextoSignificado.style.width = '35%';
        _lblTextoPalabra.style.width = '35%';
    }
    else
    {

        _txtSignificado.style.display = 'inline-block';
        _lblSignificado.style.display = 'none';
        _lblTextoSignificado.style.width = '25%';
        _lblTextoPalabra.style.width = '25%';

    }
}

function _configurarBotones()
{
    _configurarBotonAceptar();

    var _aceptar = document.getElementById("VeryMatch_btnAceptar");

    var _cancelar = document.getElementById("VeryMatch_btnCerrar");

    _aceptar.addEventListener('click', function (e)
    {
        _activarAceptar();
    });

    _cancelar.addEventListener("click", function (e)
    {
        cerrar();
    });
}

function _activarAceptar()
{
    if (_very.puedeAgregar)
        _AJAXPalabraAgregar();
    else
        cerrar();
}

function _configurarBotonAceptar()
{
    var _aceptar = document.getElementById("VeryMatch_btnAceptar");

        if (_very.puedeAgregar)
            _aceptar.textContent = "Guardar";
        else
            _aceptar.textContent = "Aceptar";
}

function _maxCorte(largo)
{

}

function _AJAXPalabraAgregar()
{
    var item = {};

    var xmlhttp = new XMLHttpRequest();

    var url = _URL_VERYMATCH + "Guardar/";

    var _lblNombre = document.getElementById("VeryMatch_lblPalabra");
    var _txtSignificado = document.getElementById("VeryMatch_txtSignificado");

    item.Nombre = _lblNombre.innerText
    item.Significado = _txtSignificado.value.substring(0, 50);

    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4)
            _setRespuestaAgregar(xmlhttp.status);
    }
    xmlhttp.open("POST", url, true);
    
    xmlhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");

    xmlhttp.send(JSON.stringify(item));
}

function _setRespuestaAgregar(estado)
{
    switch (estado)
    {
        case 1:_activarMensaje(true, "Mmmh.., así no funciona, debes seleccionar 3 palabras como máximo."); break;
        case 200: _activarMensaje(true, "La palabra '" + _ponerPuntosSuspensivos(_very.palabraSeleccionada,30) + "' se actualizado correctamente."); break;
        case 201: _activarMensaje(true, "La palabra '" + _ponerPuntosSuspensivos(_very.palabraSeleccionada,30) + "' se agregó correctamente."); break;
        default: _activarMensaje(true, "Uff!.., ocurrio algo no esperado, no se que decir.. a si, favor intentelo más tarde.");
    }
    _very.puedeAgregar = false;
    _configurarBotonAceptar();
}

function _crearPopUp()
{
    if (document.getElementById(_divVeryMatch_BOX) == null)
    {

        var _div = _nuevoPanel();
        _div.style.visibility = 'hidden'
        document.body.appendChild(_div);
        //_ajustarAltoPopUp(_veryMatch_Alto);
        
    }
}

function _setRespuestaPlantilla(textoRespuesta)
{
    // obj = JSON.parse(textoRespuesta)
    _very.usuario = 'rjara001@gmail.com';
    _very.template = textoRespuesta; // obj[1].Value;
    
    _inicio();

    // _pintarUsuarioSesion(_very.usuario);
}

function _cargarTemplate()
{
    var xmlhttp = new XMLHttpRequest();
   
    var url = _URL_HOST + "template/" //+ getParameterByName("qs");

    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            _setRespuestaPlantilla(xmlhttp.responseText);
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            
    xmlhttp.send();

}
// Se gatilla inmediatamente luego de cargar la pagina, solo la primera vez.
function _nuevoPanel()
{

    var _div = document.createElement("div");
    _div.setAttribute("id", _divVeryMatch_BOX);

    _div.setAttribute("style", _style_vm_box);

    _div.appendChild(_nuevoHeader());
//    _div.appendChild(_nuevoInfoSesion());
    _div.appendChild(_nuevoBody());
 //   _div.appendChild(_nuevoPie());

    return _div;
}

function _nuevoBody()
{
    var iframe = document.createElement('iframe');
    iframe.id = 'icontainer';
    iframe.src = chrome.runtime.getURL('container.html');

    var _div = document.createElement("div");
    _div.setAttribute("id", _divVeryMatch_INNER_BOX);

    _div.appendChild(iframe);

    // _div.innerHTML = `<iframe id='icontainer' src="chrome-extension://hcknigppdbpkncjcabgkkbicafknfecd/container.html" width="100%" height="500" frameborder="0"></iframe>`;
    return _div;
}

function _activarMensaje(visible, mensaje)
{
    var _mensaje = document.getElementById(_divVeryMatch_Mensaje);
    _mensaje.textContent = mensaje;
   
    if (visible)
        _mensaje.style.display = 'block';
    else
        _mensaje.style.display = 'none';

    _ajustarAltoPopUp();
}

function _nuevoHeader()
{

    var _div = document.createElement("div");
    var _img = document.createElement("img");

    _img.setAttribute("src", _directorioBase.replace("ID_CHROME", _very.id_browser) + "img/cerrar.png");

    _img.setAttribute("style", _style_img_cerrar);

    _div.setAttribute("style", _style_vm_header);
    _div.innerHTML = "Traductor ingles/español <b>VeryMatch</b>";
    _div.appendChild(_img);

    _img.addEventListener('click', function ()
    {
        cerrar();
    });

    return _div;
}

// Se gatilla cuando alguien selecciona un texto a traducir.
function _habilitarPopUp(e)
{
    var iframe = document.getElementById("icontainer");
    var idocument = iframe.contentWindow.document;

    var posx = 0;
    var posy = 0;

    e = e || window.event;
    //  e = jQuery.event.fix(e);

    posx = e.pageX - 10;
    posy = e.pageY - 40;

    var _div;

    _desplegarElementosSignificado(idocument);

    if (document.getElementById(_divVeryMatch_IMAGEN) == null)
    {
        _div = document.createElement("div");
        
        _div.setAttribute("id", _divVeryMatch_IMAGEN);

        _div.setAttribute("style", 'z-index:9999;position:absolute; left: ' + posx + 'px; top: ' + posy + 'px; width:24px; height:24px;background: url(' + _directorioBase.replace("ID_CHROME", _very.id_browser) + 'img/verymatch-icon.png);');

        document.body.appendChild(_div);
        _div.addEventListener('click', function ()
        {
            mover();
        });
    }
    else
    {
        _div = document.getElementById(_divVeryMatch_IMAGEN);
        _div.style.visibility = 'visible';
        
        _div.style.left = posx + 'px';
        _div.style.top = posy + 'px';
    }

    _imagenAbierta = true;

}


//Se gatilla inmediatamente luego que el usuario pincha la imagen del chinche.
function mover()
{

  
    _crearPopUp();

    _actualizarPopUp();
}

function _actualizarPopUp()
{
    //_innerPopUp = document.getElementById(_divVeryMatch_INNER_BOX);

    //_innerPopUp.innerHTML = _very.template;

    // _buscarAJAXSignificado();

     
    _activarMensaje(true, "Buscando '" + _ponerPuntosSuspensivos(_very.palabraSeleccionada, 30) + "'..");
 
}

function _setRespuestaSignificado(textoRespuesta)
{
    obj = JSON.parse(textoRespuesta)

    _very.usuario = obj[0].Value;
    _very.palabraEsTexto = (obj[1].Value=="True"?true:false);
    _very.significado = obj[2].Value;
    _very.puedeAgregar = _very.usuario.length > 0 && !_very.palabraEsTexto;
    _very.significadoAnterior = obj[3].Value;

    _pintarUsuarioSesion(_very.usuario);

    _activarMensaje(false, "");

    if (_very.palabraEsTexto)
        _pintarTextoSignificado(_very.significado);
    else
        _pintarVocabularioSignificado(_very.significado);

   

    _configurarBotonAceptar();

    _pintarUsuarioSesion(_very.usuario);

    _ajustarAltoPopUp();

    _popUpAbierto = true;

}
function _pintarUsuarioSesion(sesion)
{
    var linkSesion = document.getElementById("VeryMatch_lnkUsuario");
    
    if (sesion.length > 0)
    {
        linkSesion.textContent = sesion;
        linkSesion.setAttribute("href", _URL_HOST);
    }
    else
    {
        linkSesion.setAttribute("href", _URL_LOGIN_VERYMATCH);
        linkSesion.textContent = "iniciar sesion";
    }
        
}

function _ajustarAltoPopUp()
{
    var _img = document.getElementById(_divVeryMatch_IMAGEN);
    var _popUp = document.getElementById(_divVeryMatch_BOX);

    // _popUp.style.top = (eval(_img.style.top.replace("px", "")) - 10) + 'px';
    // _popUp.style.left = (eval(_img.style.left.replace("px", "")) - 8) + 'px';


    _img.style.zIndex = 99999;

    _innerSubPanel = document.getElementById("VeryMatch_divSubPanel");

    var altoSubPanel = _innerSubPanel.scrollHeight;
    if (_very.palabraEsTexto)
    {
        altoSubPanel = altoSubPanel - 10;
        if (altoSubPanel > 300)
            altoSubPanel = 300;

        if (altoSubPanel < 72)
            altoSubPanel = 72;

        _innerSubPanel.style.height = altoSubPanel + "px";
     }
    else
    {
        //altoSubPanel = altoSubPanel - 10;
        _innerSubPanel.style.height = altoSubPanel + "px";
    }
        

    _innerPopUp = document.getElementById("VeryMatch_Plantilla");
      
    _popUp.style.height = (_innerPopUp.clientHeight + _altoDiferenciaBox) + 'px';

    _popUp.style.visibility = 'visible';
}

function _pintarTextoSignificado(significado)
{
    var _lblTraduccion = document.getElementById("VeryMatch_lblTraduccion");
    var _tblPanel = document.getElementById("VeryMatch_tblPanel");
    _tblPanel.style.display = "none";
    _lblTraduccion.style.display = 'inline';
    _lblTraduccion.textContent = significado;
}

function _pintarVocabularioSignificado(significado)
{
    var _lblTraduccion = document.getElementById("VeryMatch_lblTraduccion");
    var _tblPanel = document.getElementById("VeryMatch_tblPanel");
    _tblPanel.style.display = 'inline';
    _lblTraduccion.style.display = "none";

    var _lblPalabra = document.getElementById("VeryMatch_lblPalabra");
    var _lblSignificado = document.getElementById("VeryMatch_lblSignificado");
    var _txtSignificado = document.getElementById("VeryMatch_txtSignificado");

    _lblPalabra.textContent = _very.palabraSeleccionada;
    _lblSignificado.textContent = significado;
    _txtSignificado.value = significado;

    if (_very.significadoAnterior.length > 0)
        _activarMensaje(true, "valor existente:'" + _ponerPuntosSuspensivos(_very.significadoAnterior, 30) + "'");
}

function _ponerPuntosSuspensivos(valor, largo)
{
    var _salida = '';
    for (_cont = 0; _cont < largo; _cont++)
    {
        if (valor.length >= _cont)
            _salida += valor.charAt(_cont);
        else
            return _salida;
    }
    return _salida + '..';
}

function _buscarAJAXSignificado()
{
    var xmlhttp = new XMLHttpRequest();

    var url = _URL_HOST + "api/Traduccion/Traducir/";
    var params = "Palabra=" + _very.palabraSeleccionada;

    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            _setRespuestaSignificado(xmlhttp.responseText);
        }
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xmlhttp.send(params);
}

function _puedeMostrarImagen(valor)
{
    valor = valor.trim();
    if (valor.length == 0)
        return false;
  
    return _very.template!=null && _very.template.length>0;
}

function cerrar()
{
    var _pop = document.getElementById(_divVeryMatch_BOX);
    var _imagen = document.getElementById(_divVeryMatch_IMAGEN);

    if (_pop!=null)
        _pop.style.visibility = 'hidden';

    _imagen.style.visibility = 'hidden';
    _popUpAbierto = false;
    _imagenAbierta = false;

    _limpiarTextos();
    //_ajustarAltoPopUp(_veryMatch_Alto);
}

function _limpiarTextos()
{
    var _lblTraduccion = document.getElementById("VeryMatch_lblTraduccion");
    var _lblPalabra = document.getElementById("VeryMatch_lblPalabra");
    var _lblSignificado = document.getElementById("VeryMatch_lblSignificado");
    var _txtSignificado = document.getElementById("VeryMatch_txtSignificado");

    _lblTraduccion.textContent = '';
    _lblPalabra.textContent = '';
    _lblSignificado.textContent = '';
    _txtSignificado.value = '';

 
}

function clickAfueraBox(obj)
{
    if (obj==null)
        return true;

    if (obj.id != _divVeryMatch_BOX)// && obj.id != _divVeryMatch_IMAGEN)
        return clickAfueraBox(obj.parentNode);

    return false;
}

function clickAfueraImagen(obj)
{
    if (obj == null)
        return true;

    if (obj.id != _divVeryMatch_IMAGEN)
        return clickAfueraImagen(obj.parentNode);

    return false;
}