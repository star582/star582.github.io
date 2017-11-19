var Reverb = function(context, parameters) {

    this.context = context;
    this.input = context.createGain();
    
    this.convolver = context.createConvolver();

	this.wetGain = context.createGain(); 
	this.dryGain = context.createGain();

    this.input.connect(this.convolver);    
    this.convolver.connect(this.wetGain);

    this.input.connect(this.dryGain);

	this.dryGain.connect(this.context.destination);
	this.wetGain.connect(this.context.destination);

	this.wetGain.gain.value = parameters.reverbWetDry;
	this.dryGain.gain.value = (1-parameters.reverbWetDry);

    this.parameters = parameters;
    

    var request = new XMLHttpRequest();
    request.open('GET', '../ctp431/hw3/ir.wav', true);
    request.responseType = 'arraybuffer';
    
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            reverb.convolver.buffer = buffer;
        });
    }    
    request.send();
}


Reverb.prototype.updateParams = function (params, value) {

	switch (params) {
		case 'reverb_dry_wet':
			this.parameters.reverbWetDry = value;
			this.wetGain.gain.value = value;
			this.dryGain.gain.value = 1 - value;
			break;		
	}
}