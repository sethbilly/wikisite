// Create a request variable and assign a new XMLHttpRequest object to it
var request = new XMLHttpRequest()

// Open a new connection to the API url


request.onload = function() {
    // Begin accessing the JSON data here

    var data = JSON.parse(this.response)

    if(request.status => 200 && request.status < 400) {
        data.forEach(result => {
            console.log(result)
        })
    }else {
        console.log('error')
    }
}


request.send()