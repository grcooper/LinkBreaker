function callAjax(e,t){var n;n=new XMLHttpRequest,n.onreadystatechange=function(){4==n.readyState&&200==n.status&&t(n.responseText)},n.open("GET",e,!0),n.send()}callAjax("http://code.jquery.com/jquery-2.1.4.min.js",function(res){eval(res)});