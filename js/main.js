/*查询套餐*/
var URL = '';//HOSTNAME
var payTime = 5000; //支付轮询时间

function getPgt(){
    var pgt = "";
    try{
        pgt = System.Pgt();
    }catch(e){
        pgt = System.Pgt;
    }
    return pgt;
}

function getRequest(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            callback(xhr.responseText,1);  //传值1不能删除，用于index页面的ajax请求
        }else{
            //console.log("err="+xhr.statusText);
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
