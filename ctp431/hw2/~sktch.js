var sound;

function preload()
{
    sound = loadSound('/ctp431/hw2/Colorful.mp3');
}

function setup() {
    var cnv = createCanvas(640, 480);    
    fft = new p5.FFT();
}
  
function draw() {

    background('#ffffff');
    
    var spectrum = fft.analyze();
    
    /*
    for (var i = 0; i< spectrum.length; i++){
        var x = map(i, 0, spectrum.length, 0, width);
        var h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h )
    }
    */


    var freq_energy = [];

    for (var i = 0; i < freq_start.length; i++)
    {
        var tmp = [];
        for (var j = 1; j <= freq_repeat; j++)
        {
            var x = fft.getEnergy(freq_start[i]*j, freq_end[i]*j);
            tmp.push(x);
        }
        freq_energy.push(tmp);
    }


    var r = [255, 255, 255, 128, 0, 0, 0, 0, 0, 128, 255, 255];
    var g = [0, 128, 255, 255, 255, 255, 255, 128, 0, 0, 0, 0];
    var b = [0, 0, 0, 0, 0, 128, 255, 255, 255, 255, 255, 128];

    var freqlen = 12;

    stroke(0, 0, 0);
    for (var i = 0; i < freqlen; i++)
    {
        var before_h_end = height;
        var before_h_len = 0;
        for (var j = 0; j < freq_repeat; j++)
        {
            //fill(r[i] - j, g[i] - j, b[i] - j);
            var r_r = map(freq_energy[i][j], 0, 255, 0, r[i]);
            var r_g = map(freq_energy[i][j], 0, 255, 0, g[i]);
            var r_b = map(freq_energy[i][j], 0, 255, 0, b[i]);

            fill(r_r, r_g, r_b);

            var x = map(i, 0, 12, 0, width/2);
            //var after_h_len = map(freq_energy[i*freqlen + j], 0, 255, 0, parseInt(height/freq_repeat));
            //var after_h_end = before_h_end - after_h_len;
            var after_h_end = before_h_end - parseInt(height/freq_repeat)//after_h_len;

            rect(x, before_h_end, width / (freqlen*2), -before_h_end + after_h_end)
            before_h_end = after_h_end;
        }
    }

    noStroke();

    fill(0,255,0); // spectrum is green
    for (var i = 0; i < freq_repeat; i++)
    {
        for (var j = 0; j < freqlen; j++)
        {
            var x = map((i*freqlen)+j, 0, (freqlen*freq_repeat), (width/2), width);
            var h = -height + map(freq_energy[j][i], 0, 255, height, 0);
            rect(x, height, width/(freqlen*freq_repeat), h);
        }
    }

    /*
    var octaveBands = fft.getOctaveBands(12, 55);
    var octaveEnergy = fft.logAverages(octaveBands);

    var loops = parseInt(octaveEnergy.length / 12) + 1;
    
    var init_color_G = 255;
    var init_color_B = 0;
    var div_color_G = 1;
    var div_color_B = 0;

    //var rainbow = ["#ff0000", "#ff8000", "#ffff00", "#80ff00", "#00ff00", "#00ff80", "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"];

    var r = [255, 255, 255, 128, 0, 0, 0, 0, 0, 128, 255, 255];
    var g = [0, 128, 255, 255, 255, 255, 255, 128, 0, 0, 0, 0];
    var b = [0, 0, 0, 0, 0, 128, 255, 255, 255, 255, 255, 128];


    stroke(0, 0, 0);
    for (var i = 0; i< 12; i++)
    {
        var before_h_end = height;
        var before_h_len = 0;
        for (var j = i; j < octaveEnergy.length; j+=12)
        {
            //fill(r[i] - j, g[i] - j, b[i] - j);
            var r_r = map(octaveEnergy[i], 0, 255, 0, r[i]);
            var r_g = map(octaveEnergy[i], 0, 255, 0, g[i]);
            var r_b = map(octaveEnergy[i], 0, 255, 0, b[i]);

            fill(r_r, r_g, r_b);

            var x = map(i, 0, 12, 0, (width / 2));
            var after_h_len = map(octaveEnergy[i], 0, 255, 0, parseInt(height/loops));
            //var after_h_end = before_h_end - after_h_len;
            var after_h_end = before_h_end - parseInt(height/loops)//after_h_len;

            rect(x, before_h_end, width / 24, before_h_end - after_h_end)
            before_h_end = after_h_end;
        }
    }
    noStroke();

    fill(0,255,0); // spectrum is green
    for (var i = 0; i< octaveEnergy.length; i++){
        var x = map(i, 0, octaveEnergy.length, (width/2), width);
        var h = -height + map(octaveEnergy[i], 0, 255, height, 0);
        rect(x, height, width/octaveEnergy.length, h );
    }
    */
}

if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }

function onPlayingClicked()
{
    var filechoose = document.getElementById("fileChooseInput");
    filechoose.src = URL.createObjectURL(filechoose.files[0]);
    var data = filechoose.src;
    
    if (sound.isPlaying()) 
    {
        sound.stop();
    }
    else {
        sound.stop();
        sound.setPath(data);
        sound.loop();
    }
}





// From https://en.wikipedia.org/wiki/Musical_note Frequencies.
// Pre-Processed for the range of frequency of each 'key'.
var freq_start
 = [108.0,
    114.6,
    121.5,
    128.9,
    136.6,
    144.9,
    153.6,
    162.9,
    171.7,
    182.0,
    193.0,
    204.7];
var freq_end
 = [112.0,
    118.5,
    125.4,
    132.8,
    140.5,
    148.8,
    157.5,
    166.8,
    177.6,
    187.9,
    198.9,
    210.6];
var freq_repeat = 5;

/*
var freq_start
 = [26.5,
    28.2,
    29.9,
    31.8,
    33.7,
    35.8,
    37.9,
    40.3,
    42.7,
    45.3,
    48,
    51,
    54,
    57.3,
    60.8,
    64.5,
    68.3,
    72.5,
    76.8,
    81.5,
    85.4,
    90.5,
    96,
    101.9,
    108,
    114.6,
    121.5,
    128.9,
    136.6,
    144.9,
    153.6,
    162.9,
    171.7,
    182,
    193,
    204.7,
    217,
    230.1,
    244,
    257.7,
    273.2,
    289.7,
    307.2,
    325.7,
    344.3,
    365,
    387,
    410.4,
    434,
    460.2,
    487.9,
    516.3,
    547.4,
    580.4,
    614.3,
    651.3,
    689.5,
    731,
    774,
    820.7,
    869,
    920.4,
    975.8,
    1033.5,
    1094.8,
    1160.7,
    1229.6,
    1302.6,
    1380,
    1462,
    1549,
    1641.3,
    1739,
    1841.7,
    1951.6,
    2068,
    2190.5,
    2321.4,
    2459.1,
    2605.1,
    2759.9,
    2924,
    3098,
    3282.5,
    3478,
    3684.4,
    3904.1,
    4136.1,
    4382,
    4642.7,
    4918.1,
    5211.1,
    5520.7,
    5849,
    6197,
    6569.9];

var freq_end
 = [28.5,
    30.1,
    31.8,
    33.7,
    35.6,
    37.7,
    39.8,
    42.2,
    44.6,
    47.2,
    49.9,
    52.9,
    56,
    59.2,
    62.7,
    66.4,
    70.2,
    74.4,
    78.7,
    83.4,
    89.3,
    94.4,
    99.9,
    105.8,
    112,
    118.5,
    125.4,
    132.8,
    140.5,
    148.8,
    157.5,
    166.8,
    177.6,
    187.9,
    198.9,
    210.6,
    223,
    236,
    249.9,
    265.6,
    281.1,
    297.6,
    315.1,
    333.6,
    354.2,
    374.9,
    396.9,
    420.3,
    446,
    472.1,
    499.8,
    530.2,
    561.3,
    594.3,
    630.2,
    667.2,
    707.4,
    748.9,
    793.9,
    840.6,
    891,
    944.3,
    999.7,
    1059.5,
    1122.7,
    1188.6,
    1259.5,
    1334.5,
    1413.9,
    1497.9,
    1586.9,
    1681.2,
    1781,
    1887.6,
    1999.5,
    2118,
    2244.4,
    2377.3,
    2519,
    2669,
    2827.8,
    2995.9,
    3173.9,
    3362.4,
    3562,
    3774.3,
    3998,
    4236,
    4487.9,
    4754.6,
    5038,
    5337,
    5654.6,
    5990.9,
    6346.9,
    6719.8];
*/