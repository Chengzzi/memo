$(function(){
	var item_list = [];
	var $detail = $(".detail");
	var $detail_mask = $(".detail-mask");
	var $delete_btn;

	init();

	$(".add-item").on("submit",function(e){
		// 清除默认事件
		e.preventDefault();
		// 获取备忘项目名称
		var new_item = {};
		new_item.content = $(this).find("input[type=text]").val();
		// 输入值为空则返回
		if(!new_item.content) return false;
		// 添加新的备忘项目
		add_item(new_item);
		reload();
		$(this).find("input[type=text]").val("");
		
	});

	$detail_mask.on("click",function(e){
		$detail.hide();
		$detail_mask.hide();
		window.onmousewheel=document.onmousewheel=function() {return true;};
	});

	function add_event(){
		$(".delete").on("click",function(e){
			var $this = $(this);
			delete_item($this);
		});
		$(".check").on("click",function(e){
			var $item = $(this).parent();
			detail_show($item);
		});
		$(".if-complete").on("click",function(e){
			if($(this).parent().hasClass("complete")){
				$(this).parent().removeClass("complete");
			}else{
				$(this).parent().addClass("complete");
			}
		});
	}

	function init(){
		item_list = store.get("list") || [];
		reload();
	}
	
	function add_item(item){
		item_list.push(item);
		store.set("list",item_list);
		return true;
	}

	function delete_item($this){
		var index = $this.parent().data('index');
		item_list.splice(index,1);
		store.set("list",item_list);
		$this.parent().remove();
		reload();
	}



	function reload(){
		$(".item-box").html("");
		for(var i=0;i<item_list.length;i++){
			creat_li(item_list[i].content,i);
		}
		add_event();
	}

	

	function delete_all(){
		store.clear();
		init();
	}

	function creat_li(content,index){
		$(".item-box").prepend(
			'<li class="item" data-index='+index+'>'+
				'<input class="if-complete" type="checkbox" name="if-complete">'+
				'<span>&nbsp'+content+'</span>'+
				'<span class="r delete">删除</span>'+
				'<span class="r check">详情</span>'+
			'</li>'
		);
	}

	function detail_show(item){
		update_detail(item);
		$detail.show();
		$detail_mask.show();
		window.onmousewheel=document.onmousewheel=function() {return false;};
	}

	function update_detail(item){
		console.log();
		var index = item.data('index');
		var detail_content = item_list[index].content|| "";
		var detail_desc = item_list[index].desc || "";
		var detail_date = item_list[index].date || "";
		$detail.html( 
			'<form class="de-form">'+
		    	'<div class="item-name">'+
		    		'<input type="text" name="" value="'+detail_content+'">'+
		    	'</div>'+
		    	'<div class="desc">'+
					'<textarea>'+detail_desc+'</textarea>'+
		    	'</div>'+
		    	'<div class="remind">'+
		    		'提醒时间：'+
					'<input type="date" value="'+detail_date+'">'+
		    	'</div>'+
		    	'<input type="submit" name="submit" value="提交">'+
			'</form>'
			);
		$(".de-form").on("submit",function(e){
			e.preventDefault();
			var new_item = {
				content: $(".item-name input").val() || "",
				desc: $(".desc textarea").val() || "",
				date: $(".remind input").val() || ""
			}
			$.extend(true, item_list[index], new_item);
			store.set("list",item_list);
			init();
		});


	}
})


