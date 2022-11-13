//Data: assume we have a list of top 5 movies - a list of JAVASCRIPT Objects
let topMovies = [{id: 0, title: "The Shawshank Redemption", year: 1994, image_url: "MEDIA/movie0.jpg"},
				 {id: 1, title: "The Godfather ", year: 1972, image_url: "MEDIA/movie1.jpg"},
				 {id: 2, title: "The Dark Knight", year: 2008, image_url: "MEDIA/movie2.jpg"},
			     {id: 3, title: "12 Angry Men", year: 1957, image_url: "MEDIA/movie3.jpg"},
			     {id: 4, title: " Schindler\'s List", year: 1993, image_url: "MEDIA/movie4.jpg"},
				];

//------------------------------------------------------------------------------------------------------
//Service Fee: $85 if the customer’s phone is "not warranty", else $0.00
//------------------------------------------------------------------------------------------------------
$('#warranty').change(function(){
	if (this.checked) {
		$('#serviceFee').val('0.00');
	} else {
		$('#serviceFee').val('85.00');
	}
});

//------------------------------------------------------------------------------------------------------
//Bond: the cost for a courtesy phone (and charger) only if the customer is a “consumer” type.
//      If customer is "business", no bond is required.

//------------------------------------------------------------------------------------------------------
//Assume there is a list of courtesy items as below:
let courtesyList = [{item: 'iPhone', bond: 275},
					{item: 'otherPhone', bond: 100},
					{item: 'charger', bond: 30}
				   ];
				   
//We will use "appState" object to track the form change when users interact with the app			   
let appState = {customerType: 'customer',
				courtesyPhone: {item: 'none', bond: 0 },//Allow to borrow ONLY 1 phone
				courtesyCharger: {item: 'none', bond: 0}//Allow to borrow ONLY 1 charger
			  };	
			  
//Click "add" Button Event
$('#addBtn').click(function(e){
	e.preventDefault();
	//Get selected Item
	let selectedItemText = $('#itemList').find(":selected").text();
	let selectedItemValue = $('#itemList').find(":selected").val();
	let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == 
	selectedItemValue.toLowerCase()).bond;
	
	
	//Build Html code of this item
	let newRow = `
				<tr class="newSelectedItem">
					<td>${selectedItemText}</td>
					<td>${selectedItemBond}</td>
				</tr>
	`;
	
	//Add this new item to the table id="borrowItems" if not existing yet
	if(appState.courtesyPhone.item == "none" && selectedItemValue.toLowerCase().includes("phone")) {
		//Add new row
		$('#borrowItems').append(newRow);
		
		//Update appState
		appState.courtesyPhone.item = selectedItemValue;
		appState.courtesyPhone.bond = selectedItemBond;
		
		//Update bond Element
		if($('#customerType').is(':checked')){
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} 
		else {
			$('#bond').val(0);
		}
		
	} else if (appState.courtesyCharger.item == "none" && selectedItemValue.toLowerCase().includes("charger")) {
		//Add new row
		$('#borrowItems').append(newRow);
		
		//Update appState
		appState.courtesyCharger.item = selectedItemValue;
		appState.courtesyCharger.bond = selectedItemBond;
		
		//Update bond Element
		if($('#customerType').is(':checked')){
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} 
		else {
			$('#bond').val(0);
		}	
	} else { 	
		alert("The item was already added!");
	}
});

$(document).ready(function() {
    $("#customer, #buisness, #warranty").change(function (){
        var bond = $("#bond").val();
        var serviceFee = $("#serviceFee").val();
        var totalFee = +bond + +serviceFee;
        var GST = (totalFee / 20) * 3;
        var totalAndGST = +totalFee + +GST;
        $("#totalFee").val(totalFee);
        $("#GST").val(GST);
        $("#totalAndGST").val(totalAndGST);
    });

    $("#addBtn, #removeBtn").click(function () {
        var bond = $("#bond").val();
        var serviceFee = $("#serviceFee").val();
        var totalFee = +bond + +serviceFee;
        var GST = (totalFee / 20) * 3;
        var totalAndGST = +totalFee + +GST;
        $("#totalFee").val(totalFee);
        $("#GST").val(GST);
        $("#totalAndGST").val(totalAndGST);
    });
});

// Click "Remove" button event
$('#removeBtn').click(function(e){
	//Prevent all default actions attached to this button
	e.preventDefault();
	
	//Remove all of added rows
	$('.newSelectedItem').remove();
	
	//Update appState
	appState.courtesyPhone = {item: 'none', bond: 0};
	appState.courtesyCharger = {item: 'none', bond: 0};
	
	$('#bond').val(0);
});

//Change 'customer type' Event
$('#customerType').click(function(){
	appState.customerType = 'business';
	$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
	
});

$('#businessType').click(function(){
	appState.customerType = 'business';
	$('#bond').val(0);
});


//FAQ
let json_url = 'http://danieldangs.com/itwd6408/json/faqs.json'
let proxy = 'https://cors-anywhere.herokuapp.com/'

$.getJSON(
	proxy + json_url,//Request json file
	function(data){
		//loop through all question and extract then and display them on webpage
		$.each(data, function(i, question){
			let content = `
				<div class="col-20 col-md-6 style="background-color: black;">
					<div class="col"
						<div class="p-q" style="background-color: orange;">
							<h4>${question.question}</h4>
							<p>${question.answer}</p>
						</div>
					</div>
				</div>
			`;
			$('#questions').append(content);
		});
	}
);

//Filter or search function
$("#search-box").on("keyup", function() {
	//Get entered keywords
	let keywords = $(this).val().toLowerCase();
	//Loop through all questions (wrapped in <div> element inside "questions" section), find all question/answer containing keywords
	$("#questions div").filter(function() {
	  //Keep displaying all element containing the keyword
	  $(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1); //indexOf(keywords) returns "-1" if not containing the keyword
	});
});

$('.content-demo-area div').hide();

//Loop through all buttons in "btn-demo-area" and add click event to each of them.
$('.btn-demo-area button').on('click', function(){
	//Set all button background color to white
	$('.btn-demo-area button').css('background-color', 'white');
	//Set this button background color to orange
	$(this).css('background-color', 'orange');
	
	//Hide all content-demo-content
	$('.content-demo-area div').hide();	
	//Show only the selected demo area
	let index = $(this).index();
	$('.content-demo-area div').eq(index).show(1000);
});

//File upload
const image_input = document.querySelector("#image-input");

image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});

//Adress autocompletion
var placeSearch, autocomplete;

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});
  autocomplete.setComponentRestrictions( {'country': 'au'});
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  var place = autocomplete.getPlace();

  var address = '';
  
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    switch (addressType){
      case 'subpremise':
        address = place.address_components[i]['short_name'] + '/' + address;
      break;
      case 'street_number':
        address = address + place.address_components[i]['short_name'] + ' ';
      break;
      case 'route':
        address += place.address_components[i]['long_name'];
      break;
      case 'locality':
        document.getElementById('suburb').value = place.address_components[i]['long_name'];
      break;
      case 'administrative_area_level_1':
        document.getElementById('region').value = place.address_components[i]['short_name'];
      break;
      case 'country':
        document.getElementById('country').value = place.address_components[i]['long_name'];
      break;
      case 'postal_code':
        document.getElementById('postal_code').value = place.address_components[i]['short_name'];
      break;
    }
  }
  
  document.getElementById('address').value = address;
  
  jQuery('#locationField').slideUp();
  jQuery('#form').slideDown();
  
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

//Drag and drop
$('h2').css({
  'background-color': 'gray',
  'text-align': 'center',
  'border': 'solid 2px green',
  'padding': '20px',
  'color': 'red'
});

//Use JQuery to handle event: hover 
$('h2').hover(function(){
  $(this).css('background-color', 'green');
} , function(){
  $(this).css('background-color', 'gray');
});	

//-------------------------------------		
$(".box" ).draggable({
  scope: 'demoBox',
  revertDuration: 100,
  start: function( event, ui ) {
    //Reset
    $( ".box" ).draggable( "option", "revert", true );
    $('.result').html('-');
  }
});

$(".drag-area" ).droppable({
   scope: 'demoBox',
   drop: function( event, ui ) {
     let area = $(this).find(".drop-area").html();
     let box = $(ui.draggable).html();     
     $( ".box" ).draggable( "option", "revert", false );
     
     //Display action in text
     $('.result').html("[Action] <b>" + box + "</b>" +
                       " dropped on " + 
                       "<b>" + area + "</b>");
     
     //Re-align item
     $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
   }
})

/*Geolocation*/
let x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
}  