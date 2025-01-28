const wordInput = document.getElementById('word-input');
const searchBtn = document.getElementById('search-btn');
const navTitle = document.getElementById('nav-title')
const titleContainer = document.getElementById('title-container');
const meaningContainer = document.getElementById('meaning-container');
const title = document.getElementById('title');
const pronunciation = document.getElementById('pronunciation');
const meaning = document.getElementById('meaning');
const description = document.getElementById('description');
const synonyms = document.getElementById('synonyms');
const audioBtn = document.getElementById('audio-btn');
const audio = document.getElementById('audio');
const definitionsContainer = document.getElementById('definitions-container');

audioBtn.style.display = 'none';

// Messages
const msg = {
    msg1: "Did you know? The word 'dictionary' comes from the Latin 'dictionarius', meaning a book of words ;)",
    msg2: "Unlock the full power of words 🥸",
    msg3: "Curious about a word? Type it in below and unlock its full potential!",
    msg4: "More than just definitions, hear how words are pronounced and see them in action!"
};

const keys = Object.keys(msg);        // Get the keys of th object
const messages = Object.values(msg);  // Convert object to an array

// Select a random message, duplicates may occur
const randomKey = keys[Math.floor(Math.random() * keys.length)];
const randomMsg = msg[randomKey];

// Select a random message, no duplicates (better for user experience)
let displayedMsg = JSON.parse(localStorage.getItem('displayedMsg')) || [];  // getItem returns the value of the key, if the key doesn't exist, it returns null
const getRandomMsg = () => {
    const availableMsg = messages.filter((_, index) => !displayedMsg.includes(index));
    // console.log(displayedMsg);
    // console.log(availableMsg);

    if (availableMsg.length === 0) {
        // Reset if all messages have been displayed
        displayedMsg = [];
        localStorage.removeItem('displayedMsg');
        return getRandomMsg();
    }

    const randomIndex = Math.floor(Math.random() * availableMsg.length);
    const selectedMsg = availableMsg[randomIndex];

    // Get the index of the selected message to uodate displayedMsg
    const selectedIndex = messages.indexOf(selectedMsg);
    displayedMsg.push(selectedIndex);

    // Update localStorage
    localStorage.setItem('displayedMsg', JSON.stringify(displayedMsg));

    return selectedMsg;
};

const firstElement = document.createElement('p');
// firstElement.innerText = randomMsg;
firstElement.innerText = getRandomMsg();;
firstElement.classList.add('first-element');
definitionsContainer.appendChild(firstElement);

// Fetch API
async function fetchApi(word) {
    try {
        title.innerText = '';
        pronunciation.innerText = '';
        definitionsContainer.innerHTML = '';
        audio.src = '';
        audioBtn.style.display = 'none';

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const result = await fetch(url).then((res) => res.json());

        if (result.title) {
            title.innerText = `No results found for «${word}»`;
            title.classList.add('not-found');
            return;
        }

        // Title and pronunciation
        title.innerText = result[0].word;
        console.log(result[0].phonetics);

        const phoneticsAudio = result[0].phonetics.find((phonetic) => phonetic.audio);
        const phoneticsText = result[0].phonetics.find((phonetic) => phonetic.text);
        console.log(phoneticsAudio);
        console.log(phoneticsText);


        if (phoneticsAudio) {
            // Set pronunciation (if available)
            pronunciation.innerText = phoneticsAudio.text || (phoneticsText ? phoneticsText.text : '');
            pronunciation.style.display = 'inline-flex';

            // Set audio (if available) 
            audio.src = phoneticsAudio.audio;
            audioBtn.style.display = 'inline-flex';
        } else if (phoneticsText) {
            // No audio, only text
            pronunciation.innerText = phoneticsText.text;
            pronunciation.style.display = 'inline-flex';
        } else {
            pronunciation.style.display = 'none';
            audioBtn.style.display = 'none';
        }

        // Also works, but less readable
        // if (phoneticsAudio) {
        //     if (phoneticsAudio.text) {
        //         pronunciation.innerText = phoneticsAudio.text || '';
        //         pronunciation.style.display = 'inline-flex';
        //     }
        //     else {
        //         result[0].phonetics.forEach((phonetic) => {
        //             if (phonetic.text) {
        //                 // pronunciation.innerText = phonetic.text[phonetic.text.length - 1] || '';
        //                 pronunciation.innerText = phonetic.text || '';
        //                 pronunciation.style.display = 'inline-flex';
        //             }
        //         });
        //     }
        //     audio.src = phoneticsAudio.audio;
        //     audioBtn.style.display = 'inline-flex';
        //     // console.log(pronunciation);
        //     // console.log(phonetics);

        // } else {
        //     result[0].phonetics.forEach((phonetic) => {
        //         if (phonetic.text) {
        //             // pronunciation.innerText = phonetic.text[phonetic.text.length - 1] || '';
        //             pronunciation.innerText = phonetic.text || '';
        //             pronunciation.style.display = 'inline-flex';
        //         }
        //     });
        // }
        // console.log(phoneticsAudio);


        // Meanings, partOfSpeech and definitions
        result[0].meanings.forEach((meaning, meaningIndex) => {
            const meaningElement = document.createElement('div');
            meaningElement.classList.add('meaning');

            // Part of speech
            const partOfSpeech = document.createElement('span');
            partOfSpeech.innerHTML = `<strong>${meaning.partOfSpeech}</strong>`;
            meaningElement.appendChild(partOfSpeech);

            // Definitions
            meaning.definitions.forEach((definition, definitionIndex) => {
                const definitionElement = document.createElement('p');
                definitionElement.classList.add('meaning');
                definitionElement.style.display = 'block';
                let space = '&nbsp;&nbsp;&nbsp;&nbsp;';
                definitionElement.innerText = `${meaningIndex + 1}.${definitionIndex + 1}. ${definition.definition}`;
                meaningElement.appendChild(definitionElement);
                // console.log(definition);


                // Example (if available)
                if (definition.example) {
                    const exampleElement = document.createElement('span');
                    exampleElement.classList.add('example');
                    exampleElement.innerText = `${definition.example}`;
                    meaningElement.appendChild(exampleElement);
                }
            });

            // Synonyms (if available)
            if (meaning.synonyms.length > 0) {
                const synonymsElement = document.createElement('p');
                synonymsElement.classList.add('synonyms');
                synonymsElement.classList.add('meaning');
                synonymsElement.innerHTML = `Syn.: <strong>${meaning.synonyms.join(', ')}</strong>`;
                meaningElement.appendChild(synonymsElement);
            }

            meaningElement.style.paddingBottom = '2rem';
            definitionsContainer.classList.add('meaning-container');
            // definitionsContainer.classList.add('box');
            definitionsContainer.appendChild(meaningElement);

        });
    } catch (error) {
        console.log(error);
        title.innerText = 'Something went wrong... Please try again later.'
    }
}

// First try ;)
// async function fetchApi(word) {
//     try {
//         titleContainer.style.display = 'none';
//         meaningContainer.style.display = 'none';
//         const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
//         const result = await fetch(url).then((res) => res.json());

//         if(result.title) {
//             meaningContainer.style.display = 'block';
//             title.innerText = word;
//             meaning.innerText = 'Meaning not found :/';
//             audioBtn.style.display = 'none';
//         } else {
//             meaningContainer.style.display = 'block';
//             audioBtn.style.display = 'inline-flex';
//             title.innerText = result[0].word;
//             pronunciation.innerText = result[0].phonetics[1].text;
//             audioBtn.src = result[0].phonetics[1].audio;

//             for(let i = 0; i < result[0].meanings.length; i++) {
//                 // meaning.innerText = `${i + 1} + ". " + result[0].meanings[i].definitions[0].definition`;
//                 // description.innerText = result[0].meanings[i].partOfSpeech;
//                 // if(result[0].meanings[i].synonyms.length > 0) {
//                 //     synonyms.style.display = 'block';
//                 //     synonyms.innerText = 'Syn.: ' + result[0].meanings[i].synonyms.join(', ');
//                 // }
//                 const meaning = result[0].meanings[i];
//                 const definitions = meaning.definitions;

//                 for(let j = 0; j < definitions.length; j++) {
//                     const definition = definitions[j];
//                     meaning.innerText += `${i + 1}.${j + 1}. ${definition.definition}`;
//                     description.innerText = `${meaning.partOfSpeech}`;

//                     if(meaning.synonyms.length > 0) {
//                         synonyms.style.display = 'block';
//                         synonyms.innerText = `Syn.: ${meaning.synonyms.join(', ')}`;
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         console.log(error);

//     }
// }

wordInput.addEventListener('keyup', (e) => {
    // if(e.target.value && wordInput.value.trim() != '' && e.key === 'Enter') {
    //     fetchApi(e.target.value);
    //     wordInput.value = '';
    //     wordInput.blur();
    // }
    if (e.key === 'Enter') {
        const word = wordInput.value.trim();
        if (word) {
            fetchApi(word);
            wordInput.value = '';
            wordInput.blur();
        } else {
            title.innerText = 'Please enter a word';
        }
    }
});

navTitle.addEventListener('click', () => {
    window.location.href = 'index.html';
    navTitle.style.cursor = 'pointer';
});

// Search word by clicking on the definition
// definitionsContainer.addEventListener('click', (e) => {
//     const clickedWord = e.target.innerText.trim();

//     if(clickedWord && e.target.classList.contains('meaning')){
//         fetchApi(clickedWord);
//     }
// });

searchBtn.addEventListener('click', () => {
    const word = wordInput.value.trim();
    if (word) {
        fetchApi(wordInput.value);
        wordInput.value = '';
        wordInput.blur();
    } else {
        title.innerText = 'Please enter a word';
        // title.classList.add('not-found')
        title.classList.add('first-element')
        pronunciation.innerText = '';
        definitionsContainer.innerHTML = '';
        audio.src = '';
        audioBtn.style.display = 'none';
    }
});

audioBtn.addEventListener('click', () => {
    if (audio.src) {
        audio.play();
    }
});