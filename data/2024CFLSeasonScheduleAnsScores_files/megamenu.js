/*global $ */
$(document).ready(function () {
    "use strict";

    // Checks if li has sub (ul) and adds class for toggle icon - just an UI
    $('.menu > ul > li > ul:not(:has(ul))').addClass('normal-sub');

    // detect touch
    if("ontouchstart" in window
       || (navigator.maxTouchPoints > 0)
       || (navigator.msMaxTouchPoints > 0)){
            $(document.documentElement).addClass("touch");
    }

    // if a touch is in progress add a class 
    $(".touch .menu > li").on("touchstart", function() {
        $(document.documentElement).addClass("has-touched");
    });

    // touch counters
    $(".touch .menu > li").on('mouseenter', function(e){
        $(this).data("touch", 0);
    });
    $(".touch .menu > li").on('click', function(e){
        if ($(this).hasClass("menu-item-has-children")) {
            $(this).data("touch", $(this).data("touch") + 1);
            if($(this).data("touch") < 2){                 
                if ($(document.documentElement).hasClass("has-touched")) {                    
                    $(document.documentElement).removeClass("has-touched"); 
                    return false;
                }
            }
        }
    });
    $("html").on('click', function(e){
        $(".touch .menu > li").data("touch", 0);
    });

    // menu events
    $(".menu > li").on('mouseenter', function(e){
        openMenu($(this));
    });
    $(".menu > li").on('mouseleave', function(e){
        closeMenu($(this));
    });
    $(".menu > li").on('click', function(e){
        // prevent html click event that closes menu
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.cancelBubble = true;
        }
    });
    $("html").on('click', function(e){
        // close menu when clicking outside
        closeMenu($(".menu > li"));
    });

    // menu open/close
    function openMenu(path){
        // replace and add custom behaviour
        path.children("ul").css("visibility", "visible");
        path.children("ul").css("opacity", "1");
    }
    function closeMenu(path){
        // replace and add custom behaviour
        path.children("ul").css("visibility", "hidden");
        path.children("ul").css("opacity", "0");
    }

});