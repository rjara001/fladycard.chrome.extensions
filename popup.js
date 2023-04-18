var _URL_VERYMATCH = "http://www.verymatch.net/api/palabra/";
var _URL_LOGIN_VERYMATCH = "http://www.verymatch.net/Account/Login/";

var _aVeryMatch_LINK = "aVeryMatch_LINK";

function ajaxBuscarUsuario()
{
    var xmlhttp = new XMLHttpRequest();
    var url = _URL_VERYMATCH + 'hello';

    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var myArr = JSON.parse(xmlhttp.responseText);
            usuario(myArr);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function usuario(obj)
{
    var _usuario = obj[0].Value.toLowerCase();
    if (_usuario.length > 0)
        document.getElementById("bUsuario").innerHTML = _usuario;
    else
    {
        var _div = document.getElementById("divBienvenido");
        var _aLink = document.createElement("a");
        _aLink.setAttribute("id", _aVeryMatch_LINK);
        _aLink.setAttribute("href", _URL_LOGIN_VERYMATCH);
        _aLink.innerHTML = "aquí";

        _aLink.addEventListener("click", function (e)
        {
            crearLogin();
        });

        _div.innerHTML = 'Hola!!, para sacar el mejor provecho a la herramienta es conveniente logearse ';
        _div.appendChild(_aLink);
    }
  
}

function crearLogin()
{
    chrome.tabs.create({ active: true, url: document.getElementById(_aVeryMatch_LINK).getAttribute('href') });
}

document.addEventListener('DOMContentLoaded', function () { ajaxBuscarUsuario(); });
