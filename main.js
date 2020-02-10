const app = document.getElementById('root');
const container = document.getElementById('container');



const errorMessage = document.getElementById('errorMsg');
var fetch = document.getElementById('fetch');

// Create a request variable and assign a new XMLHttpRequest object to it
var request = new XMLHttpRequest()

fetch.onclick = function() {

    // Remove all child nodes
    container.innerHTML = "";

    // Get article title
    var title = document.getElementById('title').value;

    // Do not show error message
    errorMessage.style.display = "none";

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
            var subs = []
            for(var i = 0; i < arrElement.length; i++) {
                if(arrElement[i].toclevel === 1) {
                    decimal = 0;
                    counter++;
                    results.push(arrElement[i]);
                    subs = [];
                }else {
                    subs.push(arrElement[i])
                    results[counter - 1]["items"] = subs;
                    decimal++
                }
            }

            // Reformat JSON data to represent desired heading and subheadings 
            var finalResults = [];
            results.forEach((element, index) => {
                var obj = {};
                obj[index + 1] = element;
                finalResults.push(obj);
            })
            console.log(finalResults);
            
            var ul = document.createElement('ol');

            finalResults.forEach((value, index) => {

                var li = document.createElement('li');
                var topLink = document.createElement('a');
                topLink.setAttribute('target', '_blank')
                topLink.href = '';
                topLink.style.textDecoration = "none";
                topLink.innerHTML = value[index + 1].line;

                var sp = document.createElement('span');
                sp.appendChild(topLink);
                if(value[index + 1].items) {
                    var inside = document.createElement('ul');
                    inside.style.listStyle = "none none";

                    var subItems = value[index + 1];
                    subItems.items.forEach((subItem, idx) => {

                        var subLi = document.createElement('li');
                        var subLink = document.createElement('a');
                        subLink.style.textDecoration = "none";
                        subLink.target = "_blank"
                        subLink.href = "";

                        subLink.innerHTML = `${index + 1}.${idx + 1}` + subItem.line;

                        var subSp = document.createElement('span')
                        subSp.appendChild(subLink);
                        subLi.appendChild(subSp);
                        inside.appendChild(subLi);
                
                    });
                    sp.appendChild(inside);
                }
                li.appendChild(sp);
                ul.appendChild(li);
            })
            container.appendChild(ul);

            
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
    var html = JSON.stringify({"html": container.innerHTML});
    console.log(html);
    var url = 'https://wikimedia.org/api/rest_v1/transform/html/from/en/to/'+chosenLang;
    request.open('POST', encodeURI(url), true);

    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
 
    // Send JSON data to REST server
    request.send(html); 

    request.onload = function() {
        var data = JSON.parse(this.response);
        if(request.status >= 200 && request.status < 400) {
            console.log(data);
            var contents = data.contents;

            // Convert contents to HTML
            var newContent = document.createElement('div')
            newContent.innerHTML = contents;
            //  Remove child node and replace with translated content
            container.removeChild(container.childNodes[0]);
            container.appendChild(newContent);
            

        }else {
            errorMessage.textContent = 'Sorry, Error translating Page';
            errorMessage.style.display = "block";
        }
    }

}
