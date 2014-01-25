<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8855-1" />
<title>C++ OpenGL - Cesar Pachón - consultoria y desarrollo de videojuegos 3D </title>

<meta name="description" content="consultoria y desarrollo de videojuegos 3D OpenGL C++" />


<meta name="keywords" content="c++, opengl, videojuegos, 3d, computación gráfica, gameplay3d " /> 

<link href="css/style.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="jsrc/myajax.js"></script>


<script type="text/javascript">
function onShowContent(content)
{
  window.location = "index.php?id="+content; 
}

function  onShowContent_ajax(content)
{
	xmlhttp.onreadystatechange=function()
	{
		if(xmlhttp.readyState==4)
  		{
		//problem to trigger javascript.. try another complex solution
				//document.getElementById('catalog_detail').innerHTML = xmlhttp.responseText;

				//http://www.webdeveloper.com/forum/archive/index.php/t-177998.html
				var search = xmlhttp.responseText;
				var script;
				while( script = search.match(/(<script[^>]+javascript[^>]+>\s*(<!--)?)/i))
				{
					search = search.substr(search.indexOf(RegExp.$1) + RegExp.$1.length);
					if (!(endscript = search.match(/((-->)?\s*<\/script>)/))) break;
					block = search.substr(0, search.indexOf(RegExp.$1));
					search = search.substring(block.length + RegExp.$1.length);
					var oScript = document.createElement('script');
					oScript.text = block;
					document.getElementsByTagName("head").item(0).appendChild(oScript);
				}
			var content_div = document.getElementById("content");
			content_div.innerHTML = xmlhttp.responseText;
			
			//try to customize width of content if it is a blog..
			/*if(content == "blog.php")
			{
				content_div.style.margin-left="30%";
				content_div.style.margin-right="40px";
			}
			else
			{
				content_div.style.margin-left="30%";
				content_div.style.margin-right="40px";				
			}*/
  		}
	}
	xmlhttp.open("GET",content,true);
	xmlhttp.send(null);
}
</script>

</head>

<body onload="javascript:initAjax(); ">

<div class="container">

<div id="header" class="header">
<!--<div class="head">header</div>-->
<h1>El Ermitaño Digital</h1>
<span class="slogan">Introspección apoyada en TICs</span>
<br><br>
<span class="slogan2">Página personal de Cesar Pachón</span>
<br><br><br>
<br><br><br>
<br><br>
<br><div align="center" style="font-style:italic">Consultor y desarrollador en software libre, computación gráfica y educación virtual <br>
<a href="#" onClick="onShowContent('contact.php');">necesitas una mano con tu proyecto?</a>
</div>
</div>

<div "menu" class="menu">

<h3><a onclick="onShowContent('start.php');">Inicio</a></h3>

<!--<h3><a onclick="onShowContent('blog.php');">Blog</a></h3>-->

<!--
<div class="menu_entry" onclick="onShowContent('mundopato.php');">Mundopato</div>
<div class="menu_entry" onclick="onShowContent('alephzero.php');">Aleph Zero</div>
<div class="menu_entry" onclick="onShowContent('virtualhumboldt.php');">Virtualhumboldt</div>
-->

<h3><a onclick="onShowContent('research.php');">Grupos de Investigación</a></h3>
<div class="menu_entry" onclick="onShowContent('prisma.php');">UNAB - prisma</div>
<div class="menu_entry" onclick="onShowContent('pcc.php');">UNAL - ccp</div>
<div class="menu_entry" onclick="onShowContent('ohwaha.php');">UNAL - ohwaha</div>
<div class="menu_entry" onclick="onShowContent('gim.php');">UMNG - gim</div>
<div class="menu_entry" onclick="onShowContent('labcom.php');">PUJ - labcom</div>

<h3><a onclick="onShowContent('areas.php');">Áreas de interés</a></h3>

<div class="menu_entry" onclick="onShowContent('nee.php');">TICs y NEE</div>
<div class="menu_entry" onclick="onShowContent('elearning.php');">e-learning</div>
<div class="menu_entry" onclick="onShowContent('virtualworlds.php');">Mundos Virtuales</div>
<div class="menu_entry" onclick="onShowContent('simuladores.php');">Simuladores</div>
<div class="menu_entry" onclick="onShowContent('teletrabajo.php');">Teletrabajo</div>
<div class="menu_entry" onclick="onShowContent('opensource.php');">Software libre</div>

<!--
<h3>Desarrollo de software</h3>
<div class="menu_entry" onclick="onShowContent('projects.php');">Java y Openoffice</div>
<div class="menu_entry" onclick="onShowContent('projects.php');">PHP</div>
<div class="menu_entry" onclick="onShowContent('projects.php');">C++</div>
-->

<h3><a onclick="onShowContent('documents.php');">Escritos y publicaciones</a></h3>
<div class="menu_entry" onclick="onShowContent('papers.php');">Papers</div>
<div class="menu_entry" onclick="onShowContent('articles.php');">Articulos</div>
<div class="menu_entry" onclick="onShowContent('tutorials.php');">Tutoriales</div>
<div class="menu_entry" onclick="onShowContent('presentations.php');">Presentaciones</div>
<!--<div class="menu_entry" onclick="onShowContent('projects.php');">Artículos</div>-->
<br>
<div class="menu_entry" onclick="onShowContent('cartoons.php');">Caricaturas</div>

<!--
<h3>Charlas y seminarios</h3>
-->
<h3><a onclick="onShowContent('references.php');">Referencias</a></h3>

<h3>
<div class="menu_entry" onclick="onShowContent('contact.php');">Contacto</div>
</h3>


</div>
<div class="content" id="content">

<?php 
	$content = 'start.php';
	if(isset($_REQUEST['id']) )
	{
		$whitelist = array("alephzero.php", 
							"areas.php", 
							"blog.php",
							"cartoons.php",
							"contact.php",
							"documents.php",
							"elearning.php",
							"gim.php",
							"index.php",
							"labcom.php",
							"mundopato.php",
							"nee.php",
							"ohwaha.php",
							"opensource.php",
							"papers.php",
							"articles.php",
							"tutorials.php",
							"pcc.php",
							"presentations.php",
							"prisma.php",
							"references.php",
							"research.php",
							"simuladores.php",
							"start.php",
							"teletrabajo.php",
							"virtualhumboldt.php",
							"virtualworlds.php"
							);
	
			$content = $_REQUEST['id']; 
			if (in_array($content, $whitelist))
			{
				include($content);
			}
			else
			{
			echo "<p>content not found.</p>";
			}
	}
	else
	{
				include("start.php");
	}
?>


</div>
<div class="footer">
Cesar Pachón 2013 - Socorro Santander Colombia - cesarpachon@gmail.com
</div>
</div>

<div id='twitterfeed' style='position:absolute;top:100px;left:80%;width:240px;height:400px;'>

<a class="twitter-timeline"  href="https://twitter.com/cesarpachon"  data-widget-id="364424298728931328">Tweets by @cesarpachon</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>


</div>

</body>

</html>
