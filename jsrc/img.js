/**
 este archivo tiene codigo javascript utilizado para el manejo de imagenes..
 www.cesarpachon.com
*/

/**
 permite abrir un popup y mostrar la imagen especificada... 
*/
function CargarFoto(img, ancho, alto){
derecha=(screen.width-ancho)/2;
arriba=(screen.height-alto)/2;
string="toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width="+ancho+",height="+alto+",left="+derecha+",top="+arriba+"";
fin=window.open(img,"",string);
}
