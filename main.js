const app = document.getElementById('root');
const container = document.createElement('div');

app.appendChild(container);


const errorMessage = document.getElementById('errorMsg');
var fetch = document.getElementById('fetch');

var request = new XMLHttpRequest()

fetch.onclick = function() {
    var title = document.getElementById('title').value;
    console.log(title);
    errorMessage.style.display = "none";

    // Create a request variable and assign a new XMLHttpRequest object to it
    

    // Open a new connection to the API url
    // Using the wikipedia rest api for getting mobile sections of an article
    var url = 'https://en.wikipedia.org/api/rest_v1/page/mobile-sections/'+title
    request.open('GET', encodeURI(url), true)


    request.onload = function() {
        // Begin accessing the JSON data here
        var data = JSON.parse(this.response)
        console.log(data);

        if(request.status >= 200 && request.status < 400) {
            
            const arrElement = data.remaining.sections;
            var counter = 0;
            var decimal = 0;
            var results = [];
            for(var i = 0; i < arrElement.length; i++) {
                if(arrElement[i].toclevel === 1) {
                    decimal = 0;
                    counter++;
                    results.push(arrElement[i]);
                }else {
                    results[counter -1][`${counter}.${decimal + 1}`] = arrElement[i];
                    decimal++
                }
            }

            var finalResults = [];
            results.forEach((element, index) => {
                var obj = {};
                obj[index + 1] = element;
                finalResults.push(obj);
            })
            console.log(finalResults);
            
            // data.remaining.sections.forEach(result => {
            //     var toclevel = result.toclevel;
            //     var line = result.line;
            //     if(toclevel == 1) {
            //         toclevel += 1;
            //     }
            //     const a = document.createElement('a')
            //     a.href = "";
            //     a.setAttribute('style', 'text-decoration:none;');
            //     a.setAttribute('target', '_blank');
            //     a.textContent =  toclevel + "."+ line;
            //     container.appendChild(a);
            // })
        }else {
            //create error message
            errorMessage.textContent = 'Sorry, Page Not Found'
            errorMessage.style.display = "block";
        }
    }
    request.send()
}

// If JSON data is not empty 
language.onchange = function() {
    // On language change call the transform API
    // POST /transform/html/{from_lang}/to/{to_lang}
    // Get selected language
    var language = document.getElementById('language');
    var chosenLang = language.options[language.selectedIndex].value;
   
    console.log('selected lang = ' + chosenLang);
    // Stringify the html container content 
    var html = JSON.stringify({"html": container.textContent});
    console.log(html);
    var url = 'https://wikimedia.org/api/rest_v1/transform/html/from/en/to/'+chosenLang;
    request.open('POST', encodeURI(url), true);

    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    

    request.onload = function() {
        var data = JSON.parse(this.response);
        if(request.status >= 200 && request.status < 400) {
            console.log(data);
            var contents = data.contents;

            // Convert contents to HTML
            var newContent = document.createElement(contents)
            container.appendChild(newContent);
            

        }else {
            errorMessage.textContent = 'Sorry, Error translating Page';
            errorMessage.style.display = "block";
        }
    }

    // Send JSON data to REST server
    request.send(html); 
}
