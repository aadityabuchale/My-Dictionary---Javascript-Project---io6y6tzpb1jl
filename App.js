const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";



        // ---------------- fetching API data ----------------- //

    async function fetchData(word) {

        try {
            const request = await fetch(API_URL + word);
            const data = await request.json();
            return data;
        }
        catch(err) {
            console.log(err);
        }
    }

    const processFetchedData = async (data) => {  // fetching data from dictionary

        const word = await fetchData(data);

        if(word.title === undefined){
            addToLocalStorage(word);
            togglePages(1);
        }
        else {
            document.querySelector("#errorMsg").innerHTML = word.title;
            setTimeout( () => {
                document.querySelector("#errorMsg").innerHTML = "";
            },5000)
        }
    }


        // ---------- handling click events ------------- //


        let searchButton = document.querySelector("#searchBtn");

        searchButton.addEventListener("click", () => {         //search
    
            let input = document.querySelector("#searchBox");
    
            if(input.value !== "")
            {
                processFetchedData(input.value);
            }
        })
    
        let historyBtn = document.querySelector("#historyBtn");
    
        historyBtn.addEventListener("click", () => {     // history
    
            if( toggle == 1)
                togglePages(toggle);
            else{
                togglePages(toggle);
            }
        })
    
        let historyPage = document.querySelector("#history-page");
    
        historyPage.addEventListener( "click" , (e) => {       // delete
    
            if( e.target.classList.contains("deleteBtn") ){
                e.target.parentNode.remove();
                removeFromLocalStorage( e.target.parentNode.childNodes[1].textContent);
                
            }
            else if( e.target.classList.contains("fa-trash") ){
    
                e.target.parentNode.parentNode.remove();
                removeFromLocalStorage(e.target.parentNode.parentNode.childNodes[1].textContent);
            }
            
        })



        // ------------ rendering & manupulating DOM ------------- //

    let toggle = 1;

    function togglePages(tog) {

        let historyPage = document.querySelector('#history-page');
        let searchPage = document.querySelector('#search-page');
        let historyBtn = document.querySelector('#historyBtn');

        if( tog == 1){
            historyPage.style.display = "flex";
            searchPage.style.display = "none";
            historyBtn.innerHTML = "Search";
            renderCards();
            toggle = 0;
        }   
        else {
            historyPage.style.display = "none";
            searchPage.style.display = "flex";
            historyBtn.innerHTML = "History";
            toggle = 1;
        }
    }

    function renderCards(){

        let historyPage = document.querySelector('#history-page');

        historyPage.innerHTML = "";

        let wordArray = JSON.parse( localStorage.getItem("words"));

        wordArray.forEach( word => {

            let meanings = word[0].meanings[ word[0].meanings.length - 1];
        
            let definitions = meanings.definitions;

            let card = document.createElement("div");
            card.className = "card";
            
            card.innerHTML = 
            `  
            <div class="word-name">
                ${word[0].word}
            </div>
            <div class="word-meaning">
                ${definitions[0].definition};
            </div>
            <button class="deleteBtn"><i class="fa-sharp fa-solid fa-trash"></i></button>
            `

            historyPage.appendChild(card);
        })
    }


    // -------------- localstorage operations ------------------ //


    function addToLocalStorage(word){                           //adding to local storage

        if( localStorage.getItem("words") === null)
        {
            localStorage.setItem( "words" , "[]");
        }

        wordArray = removeFromLocalStorage( word[0].word );
        
        wordArray.push(word);

        localStorage.setItem( "words" , JSON.stringify(wordArray));
    }


    function removeFromLocalStorage(word){                // removing from local storage

        word = word.trim();

        console.log(word);

        let wordArray = JSON.parse(localStorage.getItem("words"));

        wordArray = wordArray.filter( (w) => {
            return w[0].word != word 
        } );

        localStorage.setItem( "words" , JSON.stringify(wordArray));

        return wordArray;
    }





