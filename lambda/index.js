var Alexa = require('alexa-sdk');
var AmazonDateParser = require('amazon-date-parser');
// Data
var csunEvents = require('./data/CSUNEvents');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'NewSession': function () {

    //console.log("1111 csunEvents = " + csunEvents);
	var csunEventNumber = csunEvents.length;
	//console.log("2222 csunEventNumber = " + csunEventNumber);

    this.emit(':ask', 'Welcome to CSUN Calendar! The skill that gives you all the information on events at CSUN. There are total '+csunEventNumber+' upcoming events at CSUN. Which one would you like to know about?');
  },


  'OnDateCapture': function () {

    var date = this.event.request.intent.slots.OnDate.value;
	
	var dateRange = new AmazonDateParser(date);
	var startDate = dateRange.startDate;
	var endDate = dateRange.endDate;

	var startdateFormat = (startDate.getMonth()+1).toString().concat("-").concat(startDate.getDate().toString());

	var ssmlStartDate = '<say-as interpret-as="date" format="md"> '+startdateFormat+'</say-as>';

	var enddateFormat = (endDate.getMonth()+1).toString().concat("-").concat(endDate.getDate().toString());

	var ssmlEndDate = '<say-as interpret-as="date" format="md"> '+enddateFormat+'</say-as>';

	this.attributes['startDate'] = ssmlStartDate;
	this.attributes['endDate'] = ssmlEndDate;

	if(startdateFormat === enddateFormat)
	{
	   this.attributes['eventIndex'] = 'single';
	   this.emit(':ask', 'There is 1 event on  '+ssmlStartDate+' . Would you like to know more about this event?');
	}
	else
	{
	   this.emit(':ask', 'There are 3 events between  '+ssmlStartDate+'  and  '+ssmlEndDate+'. Which one would you like to know about?');
	}

  },


  'OnIndexCapture': function () {

	var eventIndex = this.event.request.intent.slots.OnIndex.value;

    this.attributes['eventIndex'] = eventIndex;
    this.emit(':ask', 'Event  '+eventIndex+' CSUN DataJAM will be hosted on 29 March 2018 at Oviatt Library. Would you like to know more about this event?');

  },

  'OnDetails': function () {

	var ssmlStartDate = this.attributes['startDate'];
	var ssmlEndDate = this.attributes['endDate'];
	var eventIndex = this.attributes['eventIndex'];

	if('single' === eventIndex)
	{
		this.emit(':ask', 'Education on the Edge with Thomas C. Murray at USU on  '+ssmlStartDate+'. Would you like to know about other events?');
	}
	else
	{
		this.emit(':ask','CSUN datajam events contains workshops held every Friday on methodology and technology needed to interpret and manipulate data from a large health-related dataset. Would you like to know about other events?')
	}
  },

    'NoActionIntent': function () {
      this.emit(':tell', 'Thank you for using CSUN Calendar. Have a good Day!');
  },


};
