jQuery(document).ready(function($) {

	$(".autoplay").each(function() {
		$(this).slick($(this).data());
	});

	/* Timer */
	(function ($) {
		"use strict";
		$.fn.timer = function (options) {
			var defaults = {
				classes  	 : '.countdown',
				layout	 	 : '<span class="day">%%D%%</span><span class class="colon">:</span><span class="hour">%%H%%</span><span class="colon">:</span><span class="min">%%M%%</span><span class="colon">:</span><span class="sec">%%S%%</span>',
				layoutcaption: '<div class="timer-box"><span class="day">%%D%%</span><span class="text">Days</span></div><div class="timer-box"><span class="hour">%%H%%</span><span class="text">Hrs</span></div><div class="timer-box"><span class="min">%%M%%</span><span class="text">Mins</span></div><div class="timer-box"><span class="sec">%%S%%</span><span class="text">Secs</span></div>',
				leadingZero	 : true,
				countStepper : -1, // s: -1 // min: -60 // hour: -3600
				timeout	 	 : '<span class="timeout">Time out!</span>',
			};

			var settings = $.extend(defaults, options);
			var layout			 = settings.layout;
			var layoutcaption	 = settings.layoutcaption;
			var leadingZero 	 = settings.leadingZero;
			var countStepper 	 = settings.countStepper;
			var setTimeOutPeriod = (Math.abs(countStepper)-1)*1000 + 990;
			var timeout 		 = settings.timeout;

			var methods = {
				init : function() {
					return this.each(function() {
						var $countdown 	= $(settings.classes, $(this));
						if( $countdown.length && !$countdown.hasClass('init')){
							$countdown.addClass('init');
							methods.timerLoad($countdown);
						}
					});
				},
				
				timerLoad: function(el){
					var gsecs = el.data('timer');
					if(isNaN(gsecs)){
						var start = Date.parse(new Date());
						var end = Date.parse(gsecs);
						gsecs  = (end - start)/1000;	
					}
					if(gsecs > 0 ){
						methods.CountBack(el, gsecs);
					}
				},

				calcage: function (secs, num1, num2) {
					var s = ((Math.floor(secs/num1)%num2)).toString();
					if (leadingZero && s.length < 2) s = "0" + s;
					return "<b>" + s + "</b>";
				},

				CountBack: function (el, secs) {
					if (secs < 0) {
						el.html(timeout);
						return;
					}
					if(el.hasClass('caption')){
						var timerStr = layoutcaption.replace(/%%D%%/g, methods.calcage(secs,86400,100000));
					}else {
						var timerStr = layout.replace(/%%D%%/g, methods.calcage(secs,86400,100000));					
					}
					timerStr = timerStr.replace(/%%H%%/g, methods.calcage(secs,3600,24));
					timerStr = timerStr.replace(/%%M%%/g, methods.calcage(secs,60,60));
					timerStr = timerStr.replace(/%%S%%/g, methods.calcage(secs,1,60));
					el.html(timerStr);
					setTimeout(function(){ methods.CountBack(el, (secs+countStepper))}, setTimeOutPeriod);
				},

			};

			if (methods[options]) { // $("#element").pluginName('methodName', 'arg1', 'arg2');
				return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
			} else if (typeof options === 'object' || !options) { // $("#element").pluginName({ option: 1, option:2 });
				return methods.init.apply(this);
			} else {
				$.error('Method "' + method + '" does not exist in timer plugin!');
			}
		}

		$(document).ready(function($) {
			if (typeof alo_timer_layoutcaption != 'undefined'){
				$('.alo-count-down').not('.exception').timer({
					classes			: '.countdown',
					layout			: alo_timer_layout, 
					layoutcaption	: alo_timer_layoutcaption, 
					timeout 		: alo_timer_timeout
				});
			} else {
				$('.alo-count-down').not('.exception').timer({classes : '.countdown'});			
			}
		});
	})($);
	/* End Timer */

	/* notifySlider */
	(function ($) {
	    "use strict";
	    $.fn.notifySlider = function (options) {
	      	var defaults = {
		        autoplay   : true,
		        firsttime  : 3000,
		        timeout    : 3000,
		        interval   : 10000
	      	};

			var settings    = $.extend(defaults, options);
			var firsttime   = settings.firsttime;
			var timeout     = settings.timeout;
			var interval    = settings.interval;
			var autoplay    = settings.autoplay;

	      	var methods = {
		        init : function() {
			        return this.each(function() {
			        	methods.suggestLoad($(this));
			        });
		        },
		        
		        suggestLoad: function(suggest){
		            var el  = suggest.find('.notify-slider-wrapper');
		            suggest.find('.x-close').click(function() {
		                suggest.addClass('close')
		            });
		            var slideCount    = suggest.find('.slider >.item').length;
		            var slideWidth    = suggest.find('.slider >.item').width();
		            var slideHeight   = suggest.find('.slider >.item').height();
		            var sliderUlWidth = slideCount * slideWidth;
		            // suggest.find('.notify-slider').css({ width: slideWidth, height: slideHeight });
		            suggest.find('.notify-slider .slider').css({ width: sliderUlWidth, marginLeft: - slideWidth });
		            suggest.find('.notify-slider .slider >.item:last-child').prependTo('.notify-slider .slider');
		            setTimeout(function(){ el.slideDown('slow'); }, firsttime);
		            if(!autoplay) return;
		            setInterval(function () {
		                el.slideUp({
		                        duration:'slow', 
		                        easing: 'swing',
		                        complete: function(){
		                            methods.moveRight(suggest, slideWidth);
		                            setTimeout(function(){ el.slideDown('slow'); }, timeout);
		                        }
		                    });

		            }, interval);
		        },

		        moveRight: function(suggest, slideWidth){
		            suggest.find('.notify-slider .slider').animate({
		                left: - slideWidth
		            }, 0, function () {
		                var slider = suggest.find('.notify-slider .slider');
		                suggest.find('.notify-slider .slider >.item:first-child').appendTo(slider);
		                slider.css('left', '');
		            })
		        }

	      	};

	      	if (methods[options]) { // $("#element").pluginName('methodName', 'arg1', 'arg2');
	        	return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
	      	} else if (typeof options === 'object' || !options) { // $("#element").pluginName({ option: 1, option:2 });
	        	return methods.init.apply(this);
	      	} else {
	        	$.error('Method "' + method + '" does not exist in timer plugin!');
	      	}
	    }

	    $(document).ready(function($) {
		    $('.suggest-slider').each(function() {
		    	if($(this).hasClass('autoplay')){
		    		var config = $(this).data();
		    		$(this).notifySlider(config);
		    	}
		    });  
	    });
	})($);
	/* End notifySlider */

	// spinner quantity
	(function ($) {
		jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up plus"><i class="fa fa-plus"></i></div><div class="quantity-button quantity-down minus"><i class="fa fa-minus"></i></div></div>').insertAfter('.quantity input');
		jQuery('.quantity').each(function() {
		  var spinner = jQuery(this),
		    input = spinner.find('input[type="number"]'),
		    btnUp = spinner.find('.quantity-up'),
		    btnDown = spinner.find('.quantity-down'),
		    min = input.attr('min'),
		    max = input.attr('max');

		  btnUp.click(function() {
		    var oldValue = parseFloat(input.val());
		    if (oldValue >= max) {
		      var newVal = oldValue;
		    } else {
		      var newVal = oldValue + 1;
		    }
		    spinner.find("input").val(newVal);
		    spinner.find("input").trigger("change");
		  });

		  btnDown.click(function() {
		    var oldValue = parseFloat(input.val());
		    if (oldValue <= min) {
		      var newVal = oldValue;
		    } else {
		      var newVal = oldValue - 1;
		    }
		    spinner.find("input").val(newVal);
		    spinner.find("input").trigger("change");
		  });

		});
	})($);

	// Effect accordion
	$(function() {
		$('.accordion .show-option').click(function(event) {
			event.preventDefault();
			$(this).parent().siblings().find('.fretboard').slideUp();
			$(this).parent().find('.fretboard').slideToggle();

			$(this).parent().siblings().find('.show').removeClass('active').text('+');
			($(this).parent().find('.show').text() == '-') ? ($(this).parent().find('.show').removeClass('active').text('+')) : ($(this).parent().find('.show').addClass('active').text('-'))

			$(this).parent().find('i').toggleClass('rotate');
			$(this).parent().siblings().find('i').removeClass('rotate');
		});
	});
	// end Effect accordion

	// Effect drop down
	(function ($) {
		let box = $('body .inside');	
		box.find('.drop-down').slideUp();
		$(document).mouseup(e => {
		    if (!box.is(e.target) && box.has(e.target).length === 0) 
		    { 
		    	box.find('.drop-down').slideUp(); 
		    }
		});
		box.find('.command-button').on('click', function(event) {
			event.preventDefault();
			$(this).parent().siblings().find('.drop-down').slideUp();
			$(this).parent().find('.drop-down').slideToggle();
		});
		// $(window).scroll( () => {
		// 	box.find('.drop-down').slideUp();
		// });	
	})($);
	// end Effect drop down

	// load top
	(function ($) {
		let up_btn = $("body .up");
		let body = $('body,html');
		up_btn.css({
			cursor: 'pointer'
		});
		up_btn.click(function() {
			$('html,body').animate({scrollTop: 0}, 1000);
		});
		$(window).scroll(function(event){
			let startpage = body.scrollTop();
			if(startpage > 200)
			{
				up_btn.addClass('up-active');		
			}
			else if(startpage < 200){
				up_btn.removeClass('up-active');	
			}
		});
	})($);
	// end load top

	(function ($) {
		let btn_close = $('.shopping-cart .btn-close i');
		btn_close.click(function() {
			$(this).parent().parent('tr').remove();
		});
	})($);

	// show popup
	(function ($) {
		let quickview = $('body .quick-view-home,.end-popup');
			popup = $('body .popup');
			innerpopup = setInterval(function(){ 
			quickview.addClass('start-quick-view');
			popup.addClass('start-popup');
		}, 1000);
		quickview.click( () => {
			event.preventDefault();
			quickview.removeClass('start-quick-view');
			popup.removeClass('start-popup');
			clearInterval(innerpopup);
		});
	})($);
	// end show popup

	// quickview product
	(function ($) {
		let quickview = $('body .quick-view,.end-quickview-product');
		$('body .start-quickview-product').on('click', function() {
			event.preventDefault();
			$('body .quickview-product').addClass('active');
			quickview.addClass('start-quick-view');
		});
		quickview.click(function(event) {
			event.preventDefault();
			quickview.removeClass('start-quick-view');
			$('body .quickview-product').removeClass('active');
		});
	})($);
	// end quickview product

	// pic color product
	(function ($) {
		let color_btn = $('body .product-color ul li');
		color_btn.click(function() {
			$(this).parents('.product-color').find('.color-name').text($(this).text());
		});
	})($);
	// end pic color product

	// fixed menu
	(function ($) {
		let	menu = $('header .fixed-main-menu');
			body = $('body,html');
			vitrimenu = menu.offset().top;
		$(window).scroll( () => {
			let startpage = body.scrollTop();
			(startpage >= vitrimenu) ? (menu.addClass('fixed')) : (menu.removeClass('fixed'))
		});	
	})($);
	// end fixed menu

	// tabs
	$(function() {
		$(".magic-tabs  ul li").on('click', function() {
			var container_tab = $(this).closest('.cover-tab');
			container_tab.find('.tab-content .content').removeClass('active-tab-content');
			$(this).siblings().removeClass("action-tab-btn");
			$(this).addClass('action-tab-btn');
			container_tab.find('.tab-content .content').eq($(this).index()).addClass('active-tab-content');
		});	
	});
	// end tabs

	// checked show 
	(function ($) {
		$(".choose-method .checked").change(function() {
			if(this.checked){ 
				$(this).parents('.choose-method').find('.form-hide').slideDown();
				$(this).parents('.choose-method').siblings().find('.checked').prop('checked', false);
				$(this).parents('.choose-method').siblings().find('.form-hide').slideUp();

			}
			else{
				$(this).parents('.choose-method').find('.form-hide').slideUp();
			}
		});
	})($);
	// end
	
	// use the library and function not reused
	(function ($) {
		control_menu_childmenu();
		function control_menu_childmenu(){
			let inside = $('header .main-menu .demos');
			let	menu = $('header .main-menu .child-menu-demo');
			let	control = $('header .main-menu .demos i');
			let	nen = $('.quick-view');
			let i = 0;
			control.on('click', function(event) {
				event.preventDefault();
				menu.toggleClass('play-child-menu');
				if(i == 0){
					control.css({
						transform: 'rotate(180deg)'
					});
					i=1;
				}
				else{
					control.css({
						transform: 'rotate(0deg)'
					});
					i=0;
				}
			});
			nen.click(function(event) {
				menu.removeClass('play-child-menu');
				nen.removeClass('start-quick-view');
				control.css({
					transform: 'rotate(0deg)'
				});
			});
			$(document).mouseup(e => {
			    if (!inside.is(e.target) && inside.has(e.target).length === 0) { 
			    	menu.removeClass('play-child-menu'); 
			    	control.css({
						transform: 'rotate(0deg)'
					});
			    }
			});
		}

		control_megamenu();
		function control_megamenu(){
			let inside = $('header .main-menu .mega-menu');
			let	control = $('header .main-menu .mega-menu >a >i');
			let	menu = $('header .main-menu .new-arrival-content');
			let	nen = $('.quick-view');
			let i=0
			control.on('click', function(event) {
				menu.toggleClass('play-mega-menu');
				if(i == 0){
					control.css({
						transform: 'rotate(180deg)'
					});
					i=1;
				}
				else{
					control.css({
						transform: 'rotate(0deg)'
					});
					i=0;
				}
			});
			nen.click(function(event) {
				menu.removeClass('play-mega-menu');
				nen.removeClass('start-quick-view');
				control.css({
					transform: 'rotate(0deg)'
				});
			});
			$(document).mouseup(e => {
			    if (!inside.is(e.target) && inside.has(e.target).length === 0) {
			       	menu.removeClass('play-mega-menu');
			       	control.css({
						transform: 'rotate(0deg)'
					});
			    }
			});
		}

		Tabs_tv();
		function Tabs_tv(){
			let tab_btn = $(".tv-view-1 .tv-left  ul li"); 
			let tab = $(".tv-view-1 .tv-right .tab");
			// Hiệu ứng tab
			tab_btn.on('click', function(event) {
				event.preventDefault();
				tab.removeClass('active-tab-tv');
				tab_btn.removeClass("active-btn-tab");
				$(this).addClass('active-btn-tab');
				vitritab = $(this).index();
				tab.eq(vitritab).addClass('active-tab-tv');
				// console.log(tab.eq(vitritab));
			});	
		}

		control_menu();
		function control_menu(){
			let	menu = $('header .main-bottom');
				control = $('header .control-menu-mobile i'); 
				nen = $('.quick-view');
			control.on('click', function(event) {
				event.preventDefault();
				menu.addClass('play');
				nen.addClass('start-quick-view');
			});
			nen.click(function(event) {
				menu.removeClass('play');
				nen.removeClass('start-quick-view');
			});
			$(document).mouseup(e => {
			    if (!menu.is(e.target) 
			    && menu.has(e.target).length === 0) 
			    {
			       	menu.removeClass('play');
			    }
			});
		}

		control_search();
		function control_search(){
			let menu = $('header .main-content');
				control = $('header .control-main-content i'); 
				nen = $('.quick-view');
			control.on('click', function(event) {
				event.preventDefault();
				/* Act on the event */
				menu.toggleClass('play-search');
				nen.addClass('start-quick-view');
			});
			nen.click(function(event) {
				/* Act on the event */
				menu.removeClass('play-search');
				nen.removeClass('start-quick-view');
			});
		}

		loadmore();
		function loadmore(){
			let btn_load = $('body .load-more')
				btn_close = $('body .close-loadmore')
				more_view = $('body .extra-menu-second')
				inside = $('body .cover-extra-menu')
			btn_load.click(function() {
				more_view.addClass('active-extra-menu-second');		
				btn_close.addClass('active-extra-menu-second');		
				btn_load.addClass('close-loadmore');
			});
			btn_close.click(function() {
				btn_load.removeClass('close-loadmore');
				more_view.removeClass('active-extra-menu-second');
				btn_close.removeClass('active-extra-menu-second');
				btn_close.addClass('close-loadmore');
			});
			$(document).mouseup(e => {
			    if (!inside.is(e.target) 
			    && inside.has(e.target).length === 0) 
			    {
			       	btn_load.removeClass('close-loadmore');
					more_view.removeClass('active-extra-menu-second');
					btn_close.removeClass('active-extra-menu-second');
					btn_close.addClass('close-loadmore');
			    }
			});
		}

		control_sidebar();
		function control_sidebar(){
			if ($(window).width() <= 991) {
				let control = $('.btn-active-sidebar'); 
					menu = $('.page-content .sidebar');
					end = $('.page-content .sidebar .close-sidebar');
				control.on('click', function(event) {
					event.preventDefault();
					menu.addClass('active-sidebar');
				});
				end.click(function(event) {
					menu.removeClass('active-sidebar');
				});
			}
		}

		on_window();
		function on_window(){
			let inside = $('header .content-right .el');
			$(document).mouseup(e => {
			    if (!inside.is(e.target) 
			    && inside.has(e.target).length === 0) 
			    {
			       inside.find('.list-window').removeClass('on-list-window');
			    }
			});
			inside.find('.on').on('click', function(event) {
				event.preventDefault();
				$(this).parent().siblings().find('.list-window').removeClass('on-list-window');
				$(this).parent().find('.list-window').toggleClass('on-list-window');
			});
			
		}

		closer_top();
		function closer_top(){
			let top = $('.top');
				close = $('.top .cover .close-banner i');
			close.on('click', function(event) {
				event.preventDefault();
				top.addClass('end-top');
			});
		}

	})($);
	// end use the library
	
});