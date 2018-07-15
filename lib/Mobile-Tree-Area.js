function Location(params){
    this.Init(params);
    this.InitView();
    this.InitElement();
    this.BornData();
    this.InitEvent();
}
Location.prototype.Init = function (params) {
    this.id = params.id;
    this.name = params.name;
    this.data = params.data;
    this.defaultData = params.data;
    this.tree = params.tree||3;
}

Location.prototype.InitView = function () {
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

Location.prototype.InitElement = function () {
    this.$name = document.getElementById(this.name) // 界面显示选中内容的input框

    this.$layer = document.getElementById("local-panel-layer");
    this.$list = document.getElementById("local-panel-body-list");
    this.$tabs = document.getElementById("local-panel-body-tabs");
    this.$close = document.getElementById("localPanelClose");
    this.$tab = document.getElementById('local-panel-body-tabs').children;
}

Location.prototype.InitEvent = function () {
    this.$name.addEventListener("click",LayerToggle.bind(this));
    this.$list.addEventListener("click", ListClick.bind(this));
    this.$tabs.addEventListener("click", TabsClick.bind(this));
    this.$close.addEventListener("click", CloseClick.bind(this));

    function LayerToggle() {
        if(this.$layer.style.display!="block"){
            this.$layer.style.display="block";
        }
    }

    function ListClick (e) {
        //因为我的单击事件是加在了DIV上，所以没有LI的地方会点到ui导致报错，所以要判断一下单机的是否是li
        if(e.target.tagName=="UL"||e.target.tagName=="ul"){
            return false;
        }
        //判断当前层级是否超过了用户设定的层级，如果等于就直接出结果，不等于就接着执行。
        //如果用户添加的层级大于数据本身的层级也直接出结果
        if(e.target.getAttribute("level") < this.tree && this.data[e.target.getAttribute("index")].child){
            this.createLi(e.target.getAttribute("level"),e);
            this.BornData(parseInt(e.target.getAttribute("level"))+1);
        }else if (e.target.getAttribute("level")==this.tree || !this.data[e.target.getAttribute("index")].child){
            var arrId = [];
            var arrName = [];
            for (var i = 0; i<this.$tabs.children.length-1; i++) {
                arrName.push(this.$tabs.children[i].children[0].innerHTML);
                arrId.push(this.$tabs.children[i].getAttribute("value"));
            }
            arrName.push(e.target.innerHTML);
            arrId.push(e.target.getAttribute("value"));
            document.getElementById(this.id).value=arrId.join(",");
            this.name ? document.getElementById(this.name).value=arrName.join(",") : "";
            this.$layer.style.display = "none";
            this.$tabs.innerHTML = '<li level="1" class="cur"><span>请选择</span></li>';
            this.data=this.defaultData;
            this.BornData();
        }
    }

    function TabsClick(e) {
        if(e.target.tagName == "UL"||e.target.tagName == "ul"){
            return false;
        }

        var level = e.target.parentNode.getAttribute("level");
        this.$list.innerHTML = "";
        var data = this.defaultData;
        for (var i = 0; i<level-1; i++) {
            if (data[this.$tabs.children[i].getAttribute("index")].child) {
                data = data[this.$tabs.children[i].getAttribute("index")].child;
            }
        }
        this.event = e;
        this.data = data;
        this.BornData(level);

        for(var i = 0; i < this.$tab.length; i++){
            this.$tab[i].classList.remove("cur");
        }
        e.target.parentNode.classList.add("cur");
    }

    function CloseClick () {
        this.$loginBtn.style.display="none";
        this.$tabs.innerHTML = '<li level="1" class="cur"><span>请选择</span></li>';
        this.data = this.defaultData;
        this.BornData();
    }
}

Location.prototype.BornData = function (level) {
    this.$list.innerHTML="";
    this.$list.appendChild(createFragment.call(this, level ? parseInt(level) : this.$tabs.children.length));
    function createFragment (level) {
        var fragment = document.createDocumentFragment();
        for(var i=0; i<this.data.length; i++){
            var li=document.createElement("li");
            li.setAttribute("level",level);
            li.setAttribute("value",this.data[i].id);
            li.setAttribute("index",i);
            if(this.event && this.event.target.parentNode.getAttribute("value") == this.data[i].id) li.classList.add("on");
            li.innerHTML=this.data[i].name;
            fragment.appendChild(li);
        }
        return fragment;
    }
}



Location.prototype.createLi=function(level,e){
    for(var i = 0; i < this.$tabs.children.length; i++){
        if (this.$tabs.children[i].getAttribute("level")==level) {
            if (this.$tabs.children[i].children[0].innerHTML == "请选择") {
                this.$tabs.children[i].children[0].innerHTML = e.target.innerHTML;
                this.$tabs.children[i].classList.remove("cur");
                var li=document.createElement("li");
                li.setAttribute("level",parseInt(level)+1);
                li.classList.add("cur");
                var span = document.createElement("span");
                span.innerHTML="请选择";
                li.appendChild(span);
                this.$tabs.appendChild(li);
            }else{//用户重新选择的情况

                this.$tabs.children[i].children[0].innerHTML=e.target.innerHTML;
                while (i != this.$tabs.children.length-2) {
                    this.$tabs.removeChild(this.$tabs.children[i+1]);
                }
                this.$tabs.children[i].classList.remove("cur");
                this.$tabs.children[i+1].classList.add("cur");
                this.$tabs.children[i+1].setAttribute("level",parseInt(level)+1);
            }
            this.$tabs.children[i].setAttribute("value",e.target.getAttribute("value"));
            this.$tabs.children[i].setAttribute("index",e.target.getAttribute("index"));
            break;
        }
    }
    var data = this.defaultData;
    for(var i = 0; i<level; i++){
        if (data[this.$tabs.children[i].getAttribute("index")].child) {
            data = data[this.$tabs.children[i].getAttribute("index")].child;
        } else {
            this.$tabs.removeChild(this.$tabs.childNodes[this.$tabs.childNodes.length-1]);
            this.$tabs.childNodes[this.$tabs.childNodes.length-1].classList.add("cur");
            this.$layer.style.display="none";
            this.$tabs.innerHTML = '<li level="1" class="cur"><span>请选择</span></li>';
            this.data = this.defaultData;
            this.BornData();
            return false;
        }
    }
    this.data = data;
};

module.exports = Location;
