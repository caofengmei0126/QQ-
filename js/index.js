var $musicBox = $('.musicBox');
var $header = $musicBox.find('.header');
var $footer = $musicBox.find('.footer');
var $main = $musicBox.find('.main');
var $lyric = $main.find('.lyric');
var audio = $musicBox.find('audio')[0];
var $totalTime = $footer.find('.totalTime');
var $play = $header.find('.play');
var $paused = $header.find('.paused');
var $currentTime = $footer.find('.currentTime');
var $span = $footer.find('.progressBar span');

var winHeight = document.documentElement.clientHeight||document.body.clientHeight;
var mainHeight = winHeight - $header[0].offsetHeight - $footer[0].offsetHeight -0.8*window.htmlFontSize;
$main.css('height',mainHeight);
var data = null;
function getData() {
    $.ajax({
        type:'get',
        url:'lyricl.json?_='+Math.random(),
        async:false,
        dataType:'json',
        success:function (res) {
            if(res.code == 0){
                data = res.lyric;
            }
        }

    });
}
getData();
console.log(data);
function bindData() {
    if(data && data.length){
        var str = "";
        $.each(data,function (index,item) {
            str+="<p id='"+item.id+"' second='"+item.second+"' minute='"+item.minute+"'>"+item.content+"</p>"
        });
        $lyric.html(str);
    }
}
bindData();

function autoPlay() {
    audio.play();
    audio.oncanplay = function () {
   $totalTime.html(formatTime(audio.duration));
        $play.css('display','none');
        $paused.css('display','block')
    }
}
autoPlay();
function formatTime(s) {
    var min =Math.floor( s / 60);
    var sec = Math.floor(s - min*60);
    min = min <10?"0"+min:min;
    sec = sec <10?"0"+sec:sec;
    return min + ':'+sec;
}
var timer = window.setInterval(updateProgress,1000);
var $lyricPs=$lyric.find('p') ;
function updateProgress() {
    var currentTime = audio.currentTime;
    $currentTime .html(formatTime(currentTime));
    $span.css('width',currentTime/audio.duration*100+'%');
    var mins = formatTime(currentTime).split(':')[0];
    var secs = formatTime(currentTime).split(':')[1];
    var $curP = $lyricPs.filter('[minute="'+mins+'"][second="'+secs+'"]');
    $curP.addClass('cur').siblings().removeClass('cur');
    var n = $curP.index();
    if(n>=3){
        $lyric.css({
            top:-(n-2)*0.84+"rem"
        })
    }
}

$('.musicBtn').tap(function () {
    if(audio.paused){
        audio.play();
        $play.css('display','none');
        $paused.css('display','block');
    }else {
        audio.pause();
        $play.css('display','block');
        $paused.css('display','none');
    }
});













