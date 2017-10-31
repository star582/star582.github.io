var sample_sound;
var sound;
var isPlaySample = true;

var ParticleList = [];
var lastDrawTime = 0;

var drawInterval = 200;
var bufferSize = 32;

var Particle_v = -2.0;
var accel_factor = 80;

function Particle (x, y, v_x, v_y, a_x, a_y)
{
    this.x = x;
    this.y = y;
    this.v_x = v_x;
    this.v_y = v_y;
    this.a_x = a_x;
    this.a_y = a_y;
}
Particle.prototype.setColor = function(r, g, b, a)
{
    this.c_r = r;
    this.c_g = g;
    this.c_b = b;
    this.c_a = a;
}

function preload()
{
    sample_sound = loadSound('/ctp431/hw2/pinknoise.wav');
    sound = sample_sound;
}

function setup() {
    var cnv = createCanvas(800, 600);    
    fft = new p5.FFT();
}

function draw() 
{
    if (!sound.isPlaying) return;

    var currentDate = new Date();
    var currentTime = currentDate.getTime();
    if (lastDrawTime == 0)
    {
        lastDrawTime = currentTime;
    }

    if (currentTime >= (lastDrawTime + drawInterval))
    {
        var spectrum = fft.analyze(bufferSize);
    
        var r = [255, 255, 255, 128, 0, 0, 0, 0, 0, 128, 255, 255];
        var g = [0, 128, 255, 255, 255, 255, 255, 128, 0, 0, 0, 0];
        var b = [0, 0, 0, 0, 0, 128, 255, 255, 255, 255, 255, 128];

        noStroke();
        for (var i = 0; i< bufferSize; i++)
        {
            var r_r, r_g, r_b;
            if (i < parseInt(1 * bufferSize/6))
            {
                r_r = 255;
                r_g = map(i, 0, 43, 0, 255);
                r_b = 0;
            }
            else if (i < parseInt(2 * bufferSize/6))
            {
                r_r = map(i, 43, 85, 255, 0);
                r_g = 255;
                r_b = 0;
            }
            else if (i < parseInt(3 * bufferSize/6))
            {
                r_r = 0;
                r_g = 255;
                r_b = map(i, 85, 128, 0, 255);
            }
            else if (i < parseInt(4 * bufferSize/6))
            {
                r_r = 0;
                r_g = map(i, 128, 170, 255, 0);
                r_b = 255;
            }
            else if (i < parseInt(5 * bufferSize/6))
            {
                r_r = map(i, 170, 213, 0, 255);
                r_g = 0;
                r_b = 255;
            }
            else
            {
                r_r = 255;
                r_g = 0;
                r_b = map(i, 213, 255, 255, 0);
            }
            
            var r_a = map (spectrum[i]*spectrum[i], 0, 65025, 0, 255);

            var theta = map(i, 0, bufferSize, 0, Math.PI * 2);
            var init_v_x = 0;
            var init_v_y = Particle_v;
            var final_v_x = init_v_x * cos(theta) - init_v_y * sin(theta);
            var final_v_y = init_v_x * sin(theta) + init_v_y * cos(theta);
            var pos_x = parseInt(width/2) + 10 * final_v_x;
            var pos_y = parseInt(height/2) + 10 * final_v_y;

            var particle = new Particle(pos_x, pos_y, final_v_x, final_v_y, (final_v_x/accel_factor), (final_v_y/accel_factor));
            particle.setColor(r_r, r_g, r_b, r_a);

            ParticleList.push(particle);
        }

        lastDrawTime = currentTime;
    }

    background(0);
    var i = ParticleList.length;
    while (i--)
    {
        var tmpPtc = ParticleList[i];
        tmpPtc.x = tmpPtc.x + tmpPtc.v_x;
        tmpPtc.y = tmpPtc.y + tmpPtc.v_y;

        tmpPtc.v_x = tmpPtc.v_x + tmpPtc.a_x;
        tmpPtc.v_y = tmpPtc.v_y + tmpPtc.a_y;

        if ((tmpPtc.x + 5) < 0
            || (tmpPtc.x - 5) > width
            || (tmpPtc.y + 5) < 0
            || (tmpPtc.y - 5) > height)
        {
            ParticleList.splice(i, 1);
            continue;
        }
        
        fill(tmpPtc.c_r, tmpPtc.c_g, tmpPtc.c_b, tmpPtc.c_a);
        var size = map(tmpPtc.c_a, 0, 255, 0, 15);
        ellipse(tmpPtc.x, tmpPtc.y, size, size);
    }

}


function onPlayingClicked()
{
    var filechoose = document.getElementById("fileChooseInput");
    if (filechoose.length == 0)
    {
        if (sound.isPlaying()) 
        {
            sound.stop();
        }
        return;
    }
    else
    {
        filechoose.src = URL.createObjectURL(filechoose.files[0]);
        var data = filechoose.src;
        
        if (sample_sound.isPlaying())
        {
            sample_sound.stop();
        }
        else
        {
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
    }
}

function onSamplePlayingClicked()
{
    sample_sound.setPath('/ctp431/hw2/pinknoise.wav');
    if (sound.isPlaying())
    {
        sound.stop();
    }
    else
    {
        sound = sample_sound;
        sound.loop();
    }    
}


