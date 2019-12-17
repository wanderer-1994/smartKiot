//Sequentially show banner when display on mobile
var banner = 0;
setInterval(function(){
    if(banner < 3){banner += 1;}else{banner = 0;}
    for(i = 0; i < 4; i++){
        if(i == banner){
            $('.banner div').eq(i).css('z-index', 1);
        }else{
            $('.banner div').eq(i).css('z-index', 0);
        }
    }
}, 1000)