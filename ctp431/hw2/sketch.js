function preload()
{
    sound = loadSound('Colourful.mp3');
}


function setup() {
    createCanvas(640, 480);    
    fft = new p5.FFT();
    sound.loop();
}
  
function draw() {
    /*
    if (mouseIsPressed)
    {
        fill(0);
    }
    else
    {
        fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
    */
    background(0);
    
    var spectrum = fft.analyze();
    noStroke();
    fill(0,255,0); // spectrum is green
    for (var i = 0; i< spectrum.length; i++){
        var x = map(i, 0, spectrum.length, 0, width);
        var h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h )
    }
    var waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(255,0,0); // waveform is red
    strokeWeight(1);
    for (var i = 0; i< waveform.length; i++){
        var x = map(i, 0, waveform.length, 0, width);
        var y = map( waveform[i], -1, 1, 0, height);
        vertex(x,y);
    }
    endShape();
}



/*
  song = loadSound('assets/lucky_dragons_-_power_melody.mp3');

  
  if ( song.isPlaying() ) { // .isPlaying() returns a boolean
    song.stop();
    background(255,0,0);
  } else {
    song.play();
    background(0,255,0);
  }
*/
