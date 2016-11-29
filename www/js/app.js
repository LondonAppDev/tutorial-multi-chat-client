// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
// First, we define our controller. The $scope and $document parameters tell angular
// to inject these objects, making them accessible from our controller.
.controller('MainCtrl', function($scope, $document) {

    // Output to the log so we know when our controller is loaded.
    console.log('MainCtrl loaded.');

    // Define the URL for our server. As we are only running it locally, we will
    // use localhost.
    var SERVER_URL = 'ws://localhost:7007';
    // This is a variable for our WebSocket.
    var ws;

    // Below we set the "showNameInput" and "showChatScreen" scope variables,
    // which allow us to toggle the screens so we can show the name input
    // in the beginning, and then the chat input once they have entered their
    // name.
    // Note:
    $scope.showNameInput = true;
    $scope.showChatScreen = false;

    // Set the message lod and the name input to blank.
    $scope.messageLog = '';
    $scope.userName = '';

    /**
        This function toggles between the screens. It basically just inverts
        the values of the "showNameInput" and "showChatScreen" scope variables.
        This works for our demo, but in a real app you might want to
        use different screens as opposed to showing/hiding elements on one view.
    */
    function toggleScreens() {
        $scope.showNameInput = !$scope.showNameInput;
        $scope.showChatScreen = !$scope.showChatScreen;
    }

    /** This function initiates the connection to the web socket server. */
    function connect() {
        // Create a new WebSocket to the SERVER_URL (defined above). The empty
        // array ([]) is for the protocols, which we are not using for this
        // demo.
        ws = new WebSocket(SERVER_URL, []);
        // Set the function to be called when a message is received.
        ws.onmessage = handleMessageReceived;
        // Set the function to be called when we have connected to the server.
        ws.onopen = handleConnected;
        // Set the function to be called when an error occurs.
        ws.onerror = handleError;
    }

    /**
        This is the function that is called when the WebSocket receives
        a message.
    */
    function handleMessageReceived(data) {
        // Simply call logMessage(), passing the received data.
        logMessage(data.data);
    }

    /**
        This is the function that is called when the WebSocket connects
        to the server.
    */
    function handleConnected(data) {
        // Create a log message which explains what has happened and includes
        // the url we have connected too.
        var logMsg = 'Connected to server: ' + data.target.url;
        // Add the message to the log.
        logMessage(logMsg)
    }

    /**
        This is the function that is called when an error occurs with our
        WebSocket.
    */
    function handleError(err) {
        // Print the error to the console so we can debug it.
        console.log("Error: ", err);
    }

    /** This function adds a message to the message log. */
    function logMessage(msg) {
        // $apply() ensures that the elements on the page are updated
        // with the new message.
        $scope.$apply(function() {
            //Append out new message to our message log. The \n means new line.
            $scope.messageLog = $scope.messageLog + msg + "\n";
            // Update the scrolling (defined below).
            updateScrolling();
        });
    }

    /**
        Updates the scrolling so the latest message is visible.
        NOTE: This is not really best practice... In your rela app, you
        would have this logic in the directive.
    */
    function updateScrolling() {
        // Set the ID of our message log element (textarea) in the HTML.
        var msgLogId = '#messageLog';
        // Get a handle on the element using the querySelector.
        var msgLog = $document[0].querySelector(msgLogId);
        // Set the top of the scroll to the height. This makes the box scroll
        // to the bottom.
        msgLog.scrollTop = msgLog.scrollHeight;
    }

    /** This is our scope function that is called when the user submits their name. */
    $scope.submitName = function submitName(name) {
        // If they left the name blank, then return without doing anything.
        if (!name) {
            return;
        }
        // Set the userName scope variable to the submitted name.
        $scope.userName = name;
        // Call our connect() function.
        connect();
        // Toggle the screens (hide the name input, show the chat screen)
        toggleScreens();
    };

    /** This is the scope function that is called when a users hits send. */
    $scope.sendMessage = function sendMessage(msg) {
        // Create a variable for our message (append their message to their name).
        var nameAndMsg = $scope.userName + ": " + msg;
        // Send the data to our WebSocket connection.
        ws.send(nameAndMsg);
    };
})
