/*查询套餐*/
var URL = 'http://12d30dcd.ngrok.io';
var PGT = "TGT-5-VRuOHL5pRdNTbYrRDnUU2bhwhDL7zo71ZUODlc0NdX3HwefsMi-cas";
function getRequest(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            console.log("success");
            callback(xhr.responseText,1);
        }else{
            console.log("err="+xhr.statusText);
        }

    }
    xhr.open("GET",url,true);
    xhr.send();
}
function getParams(name,url){
   var reg = new RegExp("([\?&])" + name + "=([^&]+)",'i');
   var res = reg.exec(url);
   if(res){
        return res[2]
   }else{
   	return null
   }
}
