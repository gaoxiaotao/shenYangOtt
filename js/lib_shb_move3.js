(function(window){
	var Move = function(){

	};

	Move.prototype = {
		arrFocus: null,
		area: 0,
		lastArea: 0,
		oldArea: -1,
		focusImg: null,
		focusDiv: null,
		init: function(){
			this.doMove(0);
		},
		setFocusDiv: function(focusDiv){
			this.focusDiv = focusDiv ;
		},
		setFocusImg: function(focusImg){
			this.focusImg = focusImg ;
		},
		setFocusArray: function(focusArray){
			this.arrFocus = focusArray ;
		},
		setArea: function(area){
			this.lastArea = this.area ;
			this.area = area ;
		},
		cur: function(area){
			return this.arrFocus[this.area];
		},
		last: function(area){
			return this.arrFocus[this.lastArea];
		},
		old: function(area){
			return this.oldArea == -1 ? null : this.arrFocus[this.oldArea];
		},
		toArea: function(obj){
			var type = typeof obj[0] ;
			if(type == 'number'){
                if(this.arrFocus[obj[0]].len == 0)
                    return false;
				this.setArea(obj[0]) ;
				if(obj[1] !== undefined)
					this.arrFocus[this.area].focusId = obj[1] ;
			}else if(type == 'string'){
				if(obj[0] == 'back'){
                    if(this.arrFocus[this.lastArea].len == 0)
                        return false;
					this.setArea(this.lastArea);
				}
			}
			this.doMove(0);
		},
		doMove: function(num){
			var buf = this.arrFocus[this.area].focusId + num ;
			if(buf >= 0 && buf < this.arrFocus[this.area].limit){
				var obj = this.arrFocus[this.area] ;
				var oldObj = this.arrFocus[this.oldArea] ;
				(this.oldArea != -1 && oldObj.doBlur) && oldObj.doBlur(num) ;

				this.arrFocus[this.area].focusId += num ;
				(obj.doFocus) && obj.doFocus(num);
                if(this.area !== this.oldArea){
                    this.oldArea = this.area ;
                    if(this.focusImg){
                        this.focusImg.src = obj.img ;
                        this.focusImg.width = obj.width ;
                        this.focusImg.height = obj.height ;
                    }
                }
				if(this.focusDiv){
                    if(obj.cols != undefined){
                        if(obj.left !== undefined)this.focusDiv.style.left = obj.left + (obj.focusId % obj.cols) * (obj.changeLeft || 0) + 'px';
                        if(obj.top !== undefined)this.focusDiv.style.top = obj.top + Math.floor(obj.focusId / obj.cols) * (obj.changeTop || 0) + 'px';
                    }else{
                        if(obj.left !== undefined)this.focusDiv.style.left = obj.left + Math.floor(obj.focusId / obj.rows) * (obj.changeLeft || 0) + 'px';
                        if(obj.top !== undefined)this.focusDiv.style.top = obj.top + (obj.focusId % obj.rows) * (obj.changeTop || 0) + 'px';
                    }
					if(obj.width !== undefined)this.focusDiv.style.width = obj.width + 'px';
					if(obj.height !== undefined)this.focusDiv.style.height = obj.height + 'px';
				}	
			}
		},
		has: function(dir){
			var obj = this.arrFocus[this.area] ;
			switch(dir){
				case "pre":
					return (obj.startId > 0) ? true : false ;
					break;
				case "next":
					return (obj.len - obj.startId - obj.limit > 0) ? true : false ;
					break;
				case "cols":
				case "row":
					return (obj.len - obj.startId - obj.limit >= (obj.cols || obj.row)) ? true : false ;
					break;
			}
			return false ;
		},
		on: function(dir){
			var obj = this.arrFocus[this.area] ;
            if(obj.cols){
                switch(dir){
                    case "left":
                        return (obj.focusId%obj.cols === 0) ? true : false ;
                        break;
                    case "right":
                        return (obj.focusId%obj.cols === obj.cols - 1 || obj.focusId === Math.min(obj.limit-1,obj.len-obj.startId-1)) ? true : false ;
                        break;
                    case "up":
                        return (obj.focusId < obj.cols) ? true : false ;
                        break;
                    case "down":
                        return (obj.focusId+obj.cols > Math.min(obj.limit-1,obj.len-obj.startId-1)) ? true : false ;
                        break;
                }
            }else{
                switch(dir){
                    case "up":
                        return (obj.focusId%obj.rows === 0) ? true : false ;
                        break;
                    case "down":
                        return (obj.focusId%obj.rows === obj.rows - 1 || obj.focusId === Math.min(obj.limit-1,obj.len-obj.startId-1)) ? true : false ;
                        break;
                    case "left":
                        return (obj.focusId < obj.rows) ? true : false ;
                        break;
                    case "right":
                        return (obj.focusId+obj.rows > Math.min(obj.limit-1,obj.len-obj.startId-1)) ? true : false ;
                        break;
                }
            }
		},
		doLeft: function(){
			var obj = this.arrFocus[this.area] ;
			if(this.on('left')){
				(obj.hasOwnProperty('next') && obj.next.hasOwnProperty('left')) && this.toArea(obj.next.left);
			}else{
                if(obj.cols != undefined){
                    this.doMove(-1);
                }else{
                    this.doMove(-obj.rows);
                }
			}
		},
		doRight: function(){
            var obj = this.arrFocus[this.area] ;
            if(this.on('right')){
                (obj.hasOwnProperty('next') && obj.next.hasOwnProperty('right')) && this.toArea(obj.next.right) ;
            }else{
                if(obj.cols != undefined){
                    this.doMove(1);
                }else{
                    this.doMove(obj.rows);
                }
            }
		},
		doUp: function(){
            var obj = this.arrFocus[this.area] ;
            if(this.on('up')){
                (obj.hasOwnProperty('next') && obj.next.hasOwnProperty('up')) && this.toArea(obj.next.up) ;
            }else{
                if(obj.cols != undefined){
                    this.doMove(-obj.cols);
                }else{
                    this.doMove(-1);
                }
            }
		},
		doDown: function(){
            var obj = this.arrFocus[this.area] ;
            if(this.on('down')){
                (obj.hasOwnProperty('next') && obj.next.hasOwnProperty('down')) && this.toArea(obj.next.down) ;
            }else{
                if(obj.cols != undefined){
                    this.doMove(obj.cols);
                }else{
                    this.doMove(1);
                }
            }
		},
		doOk: function(){
			var obj = this.arrFocus[this.area] ;
			if(obj.doOk){
				obj.doOk();
			}
		}
	}
	window.SHBMove = Move ;
})(window);
/*
var arrFocus = [];
arrFocus[0] = {
    focusId:0,
    startId:0,
    left:0,
    top:130,
    width:193,
    height:62,
    cols:1,//or rows
    limit:8,
    len:8,
    changeLeft:62,
    changeTop:62,
    doFocus:function(){},
    doBlur:function(){},
	doOk:function(){},
	showData:function(){},
    next:{
        right:[1]
    }
}
*/
(function(window){
	function offset(elem){
		var obj = {
			left: elem.offsetLeft ,
			top: elem.offsetTop ,
			width: elem.offsetWidth,
			height: elem.offsetHeight
		};
		while(elem != document.body){
			elem = elem.offsetParent ;
			obj.left += elem.offsetLeft ;
			obj.top += elem.offsetTop ;
		}
		return obj ;
	}

	function $(id){
		return document.getElementById(id);
	}

    var Move = function(){

    }
    Move.prototype = {
        focusDiv: null,
        focusElem: null,
        dataInfo: null,
        offset: null,
        setFocusDiv: function(focusDiv){
            this.focusDiv = focusDiv ;
        },
        setFocusElem: function(elem){
			if(!elem)return ;
            this.doBlur() ;
            this.focusElem = elem ;
            this.offset = offset(elem) ;
            this.dataInfo = eval("("+elem.getAttribute("data-info")+")");
            this.doFocus();
        },
        doFocus: function(){
			if(this.focusDiv){
				this.focusDiv.style.left = this.offset.left + "px";
				this.focusDiv.style.top = this.offset.top + "px";
				this.focusDiv.style.width = this.offset.width + "px";
				this.focusDiv.style.height = this.offset.height + "px";
			}
			this.doFocusEvent();
        },
		doFocusEvent: function(){

		},
        doBlur: function(){
            if(!this.focusElem) return;
			this.doBlurEvent();
        },
		doBlurEvent: function(){

		},
        doLeft: function(){
            if(this.dataInfo.hasOwnProperty("l")){
                var newElem = $(this.dataInfo.l);
                newElem && this.setFocusElem(newElem) ;
            }
        },
        doRight: function(){
            if(this.dataInfo.hasOwnProperty("r")){
                var newElem = $(this.dataInfo.r);
                newElem && this.setFocusElem(newElem) ;
            }
        },
        doUp: function(){
            if(this.dataInfo.hasOwnProperty("u")){
				var newElem = $(this.dataInfo.u);
				newElem && this.setFocusElem(newElem) ;
            }
        },
        doDown: function(){
            if(this.dataInfo.hasOwnProperty("d")){
                var newElem = $(this.dataInfo.d);
                newElem && this.setFocusElem(newElem) ;
            }
        }
    };
    window.SHBMove2 = Move ;

})(window);