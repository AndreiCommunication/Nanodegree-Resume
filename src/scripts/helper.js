var resumeBuilder,
    google;

var helper = {

    HTMLheaderName: '<h1 id="name">%data%</h1>',
    HTMLheaderRole: '<span class="header-role">%data%</span><hr/>',

    HTMLcontactGeneric: '<li class="flex-item"><span class="highlight-text">%contact%</span><span class="white-text">%data%</span></li>',
    HTMLmobile: '<li class="flex-item"><span class="highlight-text">mobile</span><span class="white-text">%data%</span></li>',
    HTMLemail: '<li class="flex-item"><span class="highlight-text">email</span><span class="white-text">%data%</span></li>',
    HTMLtwitter: '<li class="flex-item"><span class="highlight-text">twitter</span><span class="white-text">%data%</span></li>',
    HTMLgithub: '<li class="flex-item"><span class="highlight-text">github</span><span class="white-text">%data%</span></li>',
    HTMLblog: '<li class="flex-item"><span class="highlight-text">blog</span><span class="white-text">%data%</span></li>',
    HTMLlocation: '<li class="flex-item"><span class="highlight-text">location</span><span class="white-text">%data%</span></li>',

    HTMLbioPic: '<img src="%data%" class="biopic">',
    HTMLwelcomeMsg: '<span class="welcome-message">%data%</span>',

    HTMLskillsStart: '<h3 id="skills-h3">Skills at a Glance:</h3><ul id="skills" class="flex-box-skills"></ul>',
    HTMLskills: '<li class="flex-item"><span class="white-text">%data%</span></li>',

    // This is a div that gets manipulated into line shapes on displays of width
    // greater than 1200px wide. See _media.scss for the style information.
    // HTMLprojectLines and HTMLeducationLines are also part of the same thing.
    HTMLworkLine: '<div id="work-line"></div>',
    HTMLworkStart: '<div class="work-entry"></div>',
    HTMLworkEmployer: '<a href="#" target="_blank">%data%',
    HTMLworkTitle: ' - %data%</a>',
    HTMLworkDates: '<div class="date-text">%data%</div>',
    HTMLworkLocation: '<div class="location-text">%data%</div>',
    HTMLworkDescription: '<p><br>%data%</p>',

    HTMLprojectLines: '<div id="project-line1"></div><div id="project-line2"></div>',
    HTMLprojectStart: '</div><div class="project-entry"></div>',
    HTMLprojectTitle: '<a href="#" target="_blank">%data%</a>',
    HTMLprojectDates: '<div class="date-text">%data%</div>',
    HTMLprojectDescription: '<p><br>%data%</p>',
    HTMLprojectImage: '<a href="#" target="_blank"><img class="project-img" src="%data%"></a>',

    HTMLeducationLines: '<div id="edu-line1"></div><div id="edu-line2"></div><div id="edu-line3"></div>',
    HTMLschoolStart: '<div class="education-entry"></div>',
    HTMLschoolName: '<a href="#" target="_blank">%data%',
    HTMLschoolDegree: ' -- %data%</a>',
    HTMLschoolDates: '<div class="date-text">%data%</div>',
    HTMLschoolLocation: '<div class="location-text">%data%</div>',
    HTMLschoolMajor: '<em><br>Major: %data%</em>',

    HTMLonlineClasses: '<h3 class="online-subtitle">Online Classes</h3>',
    HTMLonlineTitle: '<a href="#" target="_blank">%data%',
    HTMLonlineSchool: ' - %data%</a>',
    HTMLonlineDates: '<div class="date-text">%data%</div>',
    HTMLonlineURL: '<br><a href="#">%data%</a>',

    // These allow us to add Font Awesome icons that link to other sites to the footer
    HTMLfooterStart: '<li class="footer-entry"></li>',
    HTMLfooterContact: '<a class="footer-icon" href="#" target="_blank"><span class="%data%"></span></a>',

    googleMap: '<div id="map"></div>',

    /*
    The next few lines about clicks are for the Collecting Click Locations quiz in Lesson 2.
    */
    clickLocations: [],

    logClicks: function(x, y) {
        'use strict';
        this.clickLocations.push({
            x: x,
            y: y
        });
        console.log('x location: ' + x + '; y location: ' + y);
    },

    /*
    This is the fun part. Here's where we generate the custom Google Map for the website.
    See the documentation below for more details.
    https://developers.google.com/maps/documentation/javascript/reference
    */


    /*
    Start here! initializeMap() is called when page is loaded.
    */

    initializeMap: function() {
        'use strict';

        var locations;

        var mapOptions = {
            disableDefaultUI: true
        };

        /*
        For the map to be displayed, the googleMap var must be
        appended to #mapDiv in resumeBuilder.js.
        */
        var map = new google.maps.Map(document.querySelector('#map'), mapOptions);


        /*
        locationFinder() returns an array of every location string from the JSONs
        written for bio, education, and work.
        */
        function locationFinder() {

            // initializes an empty array
            var locations = [];

            // adds the single location property from bio to the locations array
            locations.push(resumeBuilder.bio.contacts.location);

            // iterates through school locations and appends each location to
            // the locations array
            for (var school in resumeBuilder.education.schools) {
                locations.push(resumeBuilder.education.schools[school].location);
            }

            // iterates through work locations and appends each location to
            // the locations array
            for (var job in resumeBuilder.work.jobs) {
                locations.push(resumeBuilder.work.jobs[job].location);
            }

            return locations;
        }

        /*
        createMapMarker(placeData) reads Google Places search results to create map pins.
        placeData is the object returned from search results containing information
        about a single location.
        */

        function createMapMarker(placeData) {
            /*jshint camelcase: false */

            // The next lines save location data from the search result object to local variables
            var lat = placeData.geometry.location.lat(); // latitude from the place service
            var lon = placeData.geometry.location.lng(); // longitude from the place service
            var name = placeData.formatted_address; // name of the place from the place service
            var bounds = window.mapBounds; // current boundaries of the map window

            // marker is an object with additional data about the pin for a single location
            var marker = new google.maps.Marker({
                map: map,
                position: placeData.geometry.location,
                title: name
            });

            // infoWindows are the little helper windows that open when you click
            // or hover over a pin on a map. They usually contain more information
            // about a location.
            var infoWindow = new google.maps.InfoWindow({
                content: '<div class="marker">' + name + '</div>'
            });

            // hmmmm, I wonder what this is about...
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(map, marker);
            });

            // this is where the pin actually gets added to the map.
            // bounds.extend() takes in a map location object
            bounds.extend(new google.maps.LatLng(lat, lon));
            // fit the map to the new marker
            map.fitBounds(bounds);
            // center the map
            map.setCenter(bounds.getCenter());
        }

        /*
        callback(results, status) makes sure the search returned results for a location.
        If so, it creates a new map marker for that location.
        */
        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                createMapMarker(results[0]);
            }
        }

        /*
        pinPoster(locations) takes in the array of locations created by locationFinder()
        and fires off Google place searches for each location
        */
        function pinPoster(locations) {

            // creates a Google place search service object. PlacesService does the work of
            // actually searching for location data.
            var service = new google.maps.places.PlacesService(map);

            // Iterates through the array of locations, creates a search object for each location
            for (var place in locations) {

                // the search request object
                var request = {
                    query: locations[place]
                };

                // Actually searches the Google Maps API for location data and runs the callback
                // function with the search results after each search.
                service.textSearch(request, callback);
            }
        }

        // Sets the boundaries of the map based on pin locations
        window.mapBounds = new google.maps.LatLngBounds();

        // locations is an array of location strings returned from locationFinder()
        locations = locationFinder();

        // pinPoster(locations) creates pins on the map for each location in
        // the locations array
        pinPoster(locations);

    }

};
/*
Uncomment the code below when you're ready to implement a Google Map!
*/

// Calls the initializeMap() function when the page loads
window.addEventListener('load', helper.initializeMap);