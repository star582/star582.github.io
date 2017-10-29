function preload()
{
    sound = loadSound('/ctp431/hw2/Colorful.mp3');
}

function setup() {
    var cnv = createCanvas(640, 480);    
    fft = new p5.FFT();
}
  
function draw() {

    background(0);
    
    var spectrum = fft.analyze();
    noStroke();

    
    fill(0,255,0); // spectrum is green
    /*
    for (var i = 0; i< spectrum.length; i++){
        var x = map(i, 0, spectrum.length, 0, width);
        var h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h )
    }
    */

    /*
    * @method map
    * @param  {Number} value  the incoming value to be converted
    * @param  {Number} start1 lower bound of the value's current range
    * @param  {Number} stop1  upper bound of the value's current range
    * @param  {Number} start2 lower bound of the value's target range
    * @param  {Number} stop2  upper bound of the value's target range
    * @param  {Boolean} [withinBounds] constrain the value to the newly mapped range
    * @return {Number}        remapped number
    * @example
    */
    
    var octaveBands = fft.getOctaveBands(12);
    var octaveEnergy = fft.logAverages(octaveBands);

    var loops = parseInt(octaveEnergy.length / 12) + 1;
    
    var init_color_G = 255;
    var init_color_B = 0;
    var div_color_G = 1;
    var div_color_B = 0;

    for (var i = 0; i< 12; i++)
    {
        var before_h_end = height;
        var before_h_len = 0;
        for (var j = i; j < octaveEnergy.length; j+=12)
        {
            fill(0, init_color_G - j*div_color_G, init_color_B + i*div_color_B);

            var x = map(i, 0, 12, 0, (width / 2));
            var after_h_len = map(octaveEnergy[i], 0, 255, 0, parseInt(height/loops));
            var after_h_end = before_h_end - after_h_len;

            rect(x, before_h_end, width / 24, before_h_end - after_h_end);
            before_h_end = after_h_end;
        }
    }

    
    fill(0,255,0); // spectrum is green
    for (var i = 0; i< octaveEnergy.length; i++){
        var x = map(i, 0, octaveEnergy.length, (width/2), width);
        var h = -height + map(octaveEnergy[i], 0, 255, height, 0);
        rect(x, height, width/octaveEnergy.length, h );
    }
}

function onPlayingClicked()
{
    if (sound.isPlaying()) 
    {
        sound.pause();
    }
    else {
        sound.loop();
    }
}