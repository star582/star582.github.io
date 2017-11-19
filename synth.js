

var Voice = function(context, frequency, amplitude, parameters, output) {
	this.context = context;

	// oscillator
	this.osc = context.createOscillator();
	this.osc.onended = function () {
		this.voiceState = 0;	
	};

	this.lfo = context.createOscillator();
	this.lfo_gain = context.createGain();

	// filter 
	this.filter = context.createBiquadFilter();

	// amp envelope
	this.ampEnv = context.createGain();

	// connect
	this.osc.connect(this.filter);
	this.filter.connect(this.ampEnv);

	//this.ampEnv.connect(context.destination);
	//this.output = this.ampEnv;
	this.ampEnv.connect(output);

	// connect - LFO
	this.lfo.connect(this.lfo_gain);
	this.lfo_gain.connect(this.osc.frequency);

	// oscillator parameters
	this.osc.frequency.value = frequency;
	this.lfo.frequency.value = parameters.lfoRate;
	this.lfo_gain.gain.value = frequency*(Math.pow(2, 1.0/1200.0*parameters.lfoDepth)-1);
	//console.log(this.lfo_gain.gain.value);

	// filter parameters
	this.filterCutoffFreq = parameters.filterCutoffFreq;
	this.filterQ = parameters.filterQ;
	this.filterEnvAttackTime = parameters.filterEnvAttackTime;
	this.filterEnvDecayTime = parameters.filterEnvDecayTime;
	this.filterEnvSustainLevel = parameters.filterEnvSustainLevel;
	this.filterEnvReleaseTime = parameters.filterEnvReleaseTime;

	// amp envelop parameters
	this.ampEnvLevel = amplitude;
	this.ampEnvAttackTime = parameters.ampEnvAttackTime;
	this.ampEnvDecayTime = parameters.ampEnvDecayTime;
	this.ampEnvSustainLevel = parameters.ampEnvSustainLevel;
	this.ampEnvReleaseTime = parameters.ampEnvReleaseTime;

	this.osc.type = 'square';
	this.filter.type = 'lowpass';
	this.filter.frequency.value = 5000;

	this.ampEnv.gain.value = 0.5;

	this.voiceState = 0;	
};

Voice.prototype.on = function() {
	this.osc.start();
	this.lfo.start();
	this.triggerAmpEnvelope();
	this.triggerFilterEnvelope();

	this.voiceState = 1;
};

Voice.prototype.triggerAmpEnvelope = function() {
	var param = this.ampEnv.gain;
	var now = this.context.currentTime;

	param.cancelScheduledValues(now);

	// attack
	param.setValueAtTime(0, now);
	param.linearRampToValueAtTime(this.ampEnvLevel, now + this.ampEnvAttackTime);

	// decay
	param.linearRampToValueAtTime(this.ampEnvLevel * this.ampEnvSustainLevel, now + this.ampEnvAttackTime + this.ampEnvDecayTime);
};

Voice.prototype.triggerFilterEnvelope = function() {
	var param = this.filter.frequency;
	var now = this.context.currentTime;

	param.cancelScheduledValues(now);

	// attack
	param.setValueAtTime(0, now);
	param.linearRampToValueAtTime(this.filterCutoffFreq, now + this.filterEnvAttackTime);

	// decay
	param.linearRampToValueAtTime(this.filterCutoffFreq * this.filterEnvSustainLevel, now + this.filterEnvAttackTime + this.filterEnvDecayTime);
};

Voice.prototype.off = function() {
	var amp_gain_param = this.ampEnv.gain;
	var filter_freq_param = this.filter.frequency;
	var now = this.context.currentTime;

	amp_gain_param.cancelScheduledValues(now);
	amp_gain_param.setValueAtTime(amp_gain_param.value, now);
	amp_gain_param.exponentialRampToValueAtTime(0.001, now + this.ampEnvReleaseTime);

	this.osc.stop(now + this.ampEnvReleaseTime);
	this.lfo.stop(now + this.ampEnvReleaseTime);	

	filter_freq_param.cancelScheduledValues(now);
	filter_freq_param.setValueAtTime(filter_freq_param.value, now);
	filter_freq_param.exponentialRampToValueAtTime(0.001, now + this.filterEnvReleaseTime);
};


var Synth = function(context, parameters) {
	this.context = context;
	this.voices = {};
	this.parameters = parameters;
};

Synth.prototype.noteOn = function(midi_note_number, midi_note_velocity) {
	var frequency = this.midiNoteNumberToFrequency(midi_note_number);
	var amplitude = this.midiNoteVelocityToAmp(midi_note_velocity);

	this.voices[midi_note_number] = new Voice(this.context, frequency, amplitude, this.parameters, this.output);
	this.voices[midi_note_number].on();
};

Synth.prototype.midiNoteNumberToFrequency = function(midi_note_number) {
	var f_ref = 440;
	var n_ref = 57;
	var a = Math.pow(2, 1/12);
	var n = midi_note_number - n_ref;
	var f = f_ref * Math.pow(a, n);

	return f;
};

Synth.prototype.midiNoteVelocityToAmp = function(midi_note_velocity) {

	var min_dB = -30.0;

	// velocity to dB
	var note_dB = midi_note_velocity/128.0*(-min_dB) + min_dB;

	// dB to velocity
	var velocity = Math.pow(10.0, note_dB/20.0);

	return velocity;

};


Synth.prototype.noteOff = function(midi_note_number) {
	this.voices[midi_note_number].off();

};


Synth.prototype.updateParams = function(params, value) {

	switch (params) {
		case 'lfo_rate': 
			this.parameters.lfoRate = value;
			break;		
		case 'lfo_depth': 
			this.parameters.lfoDepth = value;
			break;		
		case 'filter_freq': 
			this.parameters.filterCutoffFreq = value;
			break;		
		case 'filter_env_attack_time': 
			this.parameters.filterEnvAttackTime = value;
			break;		
		case 'filter_env_decay_time':
			this.parameters.filterEnvDecayTime = value;
			break;		
		case 'filter_env_sustain_level':
			this.parameters.filterEnvSustainLevel = value;
			break;		
		case 'filter_env_release_time':
			this.parameters.filterEnvReleaseTime = value;
			break;		
		case 'amp_attack_time': 
			this.parameters.ampEnvAttackTime = value;
			break;		
		case 'amp_decay_time':
			this.parameters.ampEnvDecayTime = value;
			break;		
		case 'amp_sustain_level':
			this.parameters.ampEnvSustainLevel = value;
			break;		
		case 'amp_release_time':
			this.parameters.ampEnvReleaseTime = value;
			break;		
	}
}

Synth.prototype.connect = function(fx_node) {
	this.output = fx_node.input;
}

