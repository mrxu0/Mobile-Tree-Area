function Location(params){
    this.id=params.id;
    this.name=params.name;
    this.data=params.data;
    this.defaultData=params.data;
    this.tree=params.tree||3;
    this.InitAndChangeData();
    this.clickElement();
};
Location.prototype.InitAndChangeData=function (level) {

    if(!document.getElementById("local-panel-layer")){
        var str=`
        <div class="local-panel-layer" id="local-panel-layer">
            <div class="local-panel">
                <div class="local-panel-head">
                    所在地区<span id="localPanelClose" class="close">取消</span>
                </div>
                <div class="local-panel-body">
                    <ul class="local-panel-body-tabs" id="local-panel-body-tabs">
                        <li level="1" class="cur"><span>请选择</span></li>
                    </ul>
                    <ul class="local-panel-body-list" id="local-panel-body-list"></ul>
                </div>
            </div>
        </div>
    `
        var div=document.createElement("div");
        div.innerHTML=str;
        document.body.appendChild(div);
    }

    var list=document.getElementById('local-panel-body-list');
    list.innerHTML="";
    list.appendChild(this.createFragment(level?parseInt(level):document.getElementById('local-panel-body-tabs').children.length));
};
Location.prototype.createFragment=function(level){
    var fragment = document.createDocumentFragment();
    for(var i=0;i<this.data.length;i++){
        var li=document.createElement("li");
        li.setAttribute("level",level);
        li.setAttribute("value",this.data[i].id);
        li.setAttribute("index",i);
        if(this.event&&this.event.target.parentNode.getAttribute("value")==this.data[i].id) li.classList.add("on");
        li.innerHTML=this.data[i].name;
        fragment.appendChild(li);
    }
    return fragment;
};
Location.prototype.clickElement=function(){
    var that=this;
    var localPanelLayer=document.getElementById("local-panel-layer");
    var localPanelBodyList=document.getElementById("local-panel-body-list");
    var localPanelBodyTabs=document.getElementById("local-panel-body-tabs");
    document.getElementById(this.name).addEventListener("click",function(){
        if(localPanelLayer.style.display!="block"){
            localPanelLayer.style.display="block";
        }
    });
    localPanelBodyList.addEventListener("click",function (e){
        if(e.target.tagName=="UL"||e.target.tagName=="ul"){
            return false;
        }

        if(e.target.getAttribute("level")<that.tree&&that.data[e.target.getAttribute("index")].child){
            that.createLi(e.target.getAttribute("level"),e);
            that.InitAndChangeData(parseInt(e.target.getAttribute("level"))+1);
        }else if(e.target.getAttribute("level")==that.tree||!that.data[e.target.getAttribute("index")].child){
            var arrId=[];
            var arrName=[];
            for(var i=0;i<localPanelBodyTabs.children.length-1;i++){
                arrName.push(localPanelBodyTabs.children[i].children[0].innerHTML);
                arrId.push(localPanelBodyTabs.children[i].getAttribute("value"));
            }
            arrName.push(e.target.innerHTML);
            arrId.push(e.target.getAttribute("value"));
            document.getElementById(that.id).value=arrId.join(",");
            that.name?document.getElementById(that.name).value=arrName.join(","):"";
            localPanelLayer.style.display="none";
            localPanelBodyTabs.innerHTML='<li level="1" class="cur"><span>请选择</span></li>';
            that.data=that.defaultData;
            that.InitAndChangeData();
        }
    });
    document.getElementById("local-panel-body-tabs").addEventListener("click",function (e) {
        if(e.target.tagName=="UL"||e.target.tagName=="ul"){
            return false;
        }
        that.event=e;
        var level=e.target.parentNode.getAttribute("level");
        var localPanelBodyList=document.getElementById('local-panel-body-list');
        var tab=document.getElementById('local-panel-body-tabs').children;
        localPanelBodyList.innerHTML="";
        var data=that.defaultData;
        for(var i=0;i<level-1;i++){
            if(data[localPanelBodyTabs.children[i].getAttribute("index")].child){
                data=data[localPanelBodyTabs.children[i].getAttribute("index")].child;
            }
        }
        that.data=data;
        that.InitAndChangeData(level);
        for(var i=0;i<tab.length;i++){
            tab[i].classList.remove("cur");
        }
        e.target.parentNode.classList.add("cur");
    });
    document.getElementById("localPanelClose").addEventListener("click",function () {
        document.getElementById("local-panel-layer").style.display="none";
        document.getElementById("local-panel-body-tabs").innerHTML='<li level="1" class="cur"><span>请选择</span></li>';
        that.data=that.defaultData;
        that.InitAndChangeData();
    })
};
Location.prototype.createLi=function(level,e){
    var localPanelBodyTabs=document.getElementById("local-panel-body-tabs");
    for(var i=0;i<localPanelBodyTabs.children.length;i++){
        if(localPanelBodyTabs.children[i].getAttribute("level")==level){
            if(localPanelBodyTabs.children[i].children[0].innerHTML=="请选择"){
                localPanelBodyTabs.children[i].children[0].innerHTML=e.target.innerHTML;
                localPanelBodyTabs.children[i].classList.remove("cur");
                var li=document.createElement("li");
                li.setAttribute("level",parseInt(level)+1);
                li.classList.add("cur");
                var span=document.createElement("span");
                span.innerHTML="请选择";
                li.appendChild(span);
                localPanelBodyTabs.appendChild(li);
            }else{//用户重新选择的情况

                localPanelBodyTabs.children[i].children[0].innerHTML=e.target.innerHTML;
                while(i!=localPanelBodyTabs.children.length-2){
                    localPanelBodyTabs.removeChild(localPanelBodyTabs.children[i+1]);
                }
                localPanelBodyTabs.children[i].classList.remove("cur");
                localPanelBodyTabs.children[i+1].classList.add("cur");
                localPanelBodyTabs.children[i+1].setAttribute("level",parseInt(level)+1);
            }
            localPanelBodyTabs.children[i].setAttribute("value",e.target.getAttribute("value"));
            localPanelBodyTabs.children[i].setAttribute("index",e.target.getAttribute("index"));
            break;
        }
    }
    var data=this.defaultData;
    for(var i=0;i<level;i++){
        if(data[localPanelBodyTabs.children[i].getAttribute("index")].child){
            data=data[localPanelBodyTabs.children[i].getAttribute("index")].child;
        }else{
            localPanelBodyTabs.removeChild(localPanelBodyTabs.childNodes[localPanelBodyTabs.childNodes.length-1]);
            localPanelBodyTabs.childNodes[localPanelBodyTabs.childNodes.length-1].classList.add("cur");
            document.getElementById("local-panel-layer").style.display="none";
            document.getElementById("local-panel-body-tabs").innerHTML='<li level="1" class="cur"><span>请选择</span></li>';
            this.data=this.defaultData;
            this.InitAndChangeData();
            return false;
        }
    }
    this.data=data;
};
