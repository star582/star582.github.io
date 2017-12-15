var kick1 = new getSound("kick1","https://dl.dropboxusercontent.com/s/q9ffbq1esfufado/kick3.wav?dl=0");
var kick2 = new getSound("kick2","https://dl.dropboxusercontent.com/s/fx62nliy7zgv0rg/kick1.wav?dl=0");
var kick3 = new getSound("kick3","https://dl.dropboxusercontent.com/s/ragnfpvaqlxnwzb/kick4.wav?dl=0");
var clap1 = new getSound("clap1","https://dl.dropboxusercontent.com/s/xlv8x19wvg9ynh8/clap1.wav?dl=0");
var clap2 = new getSound("clap2","https://dl.dropboxusercontent.com/s/og84e9s5g4z8wyx/clap2.wav?dl=0");
var clap3 = new getSound("clap3","https://dl.dropboxusercontent.com/s/4741pvdfsv5x82b/clap3.wav?dl=0");
var bass1 = new getSound("bass1","https://dl.dropboxusercontent.com/s/oc7yrdrk64w66ck/bass1.wav?dl=0");
var bass2 = new getSound("bass2","https://dl.dropboxusercontent.com/s/73ejwnwpcxlxte9/distor.wav?dl=0");
var hoover1 = new getSound("hoover1","https://dl.dropboxusercontent.com/s/x5oc2av9xoqfydq/hoover.wav?dl=0");
var fx = new getSound("fx","https://dl.dropboxusercontent.com/s/nd79xe2s83jg4sh/fxs.wav?dl=0");

var context = new AudioContext();

$(document).keydown(function(e) {
  console.log(e.which);
  $("[data-key='" + e.which + "']").trigger('click');
});

function getSound(domNode,fileDirectory) {
   this.domNode = domNode;
   this.fileDirectory = fileDirectory;
   var play = play;
   var incomingBuffer;
   var savedBuffer;
   var xhr;
   play = function () {
     var source = context.createBufferSource();
     source.buffer = savedBuffer;
     source.connect(context.destination);
     source.start(0);
   };
   var xhr = new XMLHttpRequest();
   xhr.open('get',fileDirectory, true);
   xhr.responseType = 'arraybuffer';
   xhr.onload = function () {
   context.decodeAudioData(xhr.response,
      function(incomingBuffer) {
      savedBuffer = incomingBuffer;
      var note = document.getElementById(domNode);
      note.addEventListener("click", play , false);
        }
     );
  };
xhr.send();
};

 $(".pad").click(function () {
    var button_color = $(this).data('color');
    $(this).effect("highlight",{color:button_color}, 160 );
 });
