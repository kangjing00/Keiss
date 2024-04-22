{/* <script type="text/javascript"> */}
/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// Client ID and API key from the Developer Console
const CLIENT_ID = '12229461369-lv1cno2gddcsnq7iknn713ql1vgjnobh.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBlERd_ybBw6PmCzmngZ_hiWaeI0o7wsR4';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    client_id: CLIENT_ID,
    scope: SCOPES,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await listMajors();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors() {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1ILcN9fXer3wFh-tAzrAbG_Pq-JR7fGyN1aTf35sKb3E',
      range: 'Class Data!A2:E',
    });
  } catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    document.getElementById('content').innerText = 'No values found.';
    return;
  }
  // Flatten to string to display
  const output = range.values.reduce(
      (str, row) => `${str}${row[0]}, ${row[4]}\n`,
      'Name, Major:\n');
  document.getElementById('content').innerText = output;
}

function testGetAPI(){
    let response;
    var params = {
        spreadsheetId: '1ILcN9fXer3wFh-tAzrAbG_Pq-JR7fGyN1aTf35sKb3E',
        range: 'Database',
        // valueRenderOption: '',
        // dateTimeRenderOption: '',
    }; 

    try {
        // Fetch first 10 files
        response = gapi.client.sheets.spreadsheets.values.get(
            params 
        );
        // response = gapi.client.sheets.spreadsheets.values.get({
        //   spreadsheetId: '1ILcN9fXer3wFh-tAzrAbG_Pq-JR7fGyN1aTf35sKb3E',
        //   range: 'Class Data!A2:E',
        // });

        request.then(function(response) {
            console.log(response.result);
        },function(reason){
            console.error('error' + reason.result.error.message);
        });
    } catch (err) {
        document.getElementById('content1').innerText = err.message;
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        document.getElementById('content1').innerText = 'No values found.';
        return;
    }
}


// Button Clicked
$(document).ready(function($) {
   
    s1 = $(document).find('.screen_home').html();
    var e0 = $(document).find('.screen_data'); 

    e0.html(s1);

    $(document).on('click', '.btn_menu', function(event) {
        event.preventDefault();

        var screen_name = $(this).attr('screen_name');


        $(document).find('.screen_name').html(screen_name);

        if (screen_name == "home") {
            var s1 = $(document).find('.screen_home').html();
            e0.html(s1);
        } else if (screen_name == "about") {
            var s1 = $(document).find('.screen_about').html();
            e0.html(s1);

        } else if (screen_name == "services") {
            var s1 = $(document).find('.screen_services').html();
            e0.html(s1);

        } else if (screen_name == "contact") {
            var s1 = $(document).find('.screen_contact').html();
            e0.html(s1);
        }

    });

    $(document).on('click', '.btn_send_contact', function(event) {
      
      event.preventDefault();

      var e1 = $(this).closest('.screen_data');


      var a1={
        user_name:e1.find('.user_name').val(),
        user_email:e1.find('.user_email').val(),
        user_subject:e1.find('.user_subject').val(),
        user_msg:e1.find('.user_msg').val(),
        user_dttm:moment().format("YYYY-MM-DD HH:MM:SS A"),
      };

      console.log(a1);

    if(gapiInited){
        testGetAPI();
    }

    //   google.script.run.withSuccessHandler(function(data)
    //   {
         
    //     if(data.status == "success"){

    //     }
        
    //   }).AddNewContact(a1) 


    });
});
// </script>
