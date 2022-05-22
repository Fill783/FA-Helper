// ==UserScript==
// @name                FA Helper
// @version             1.5.2
// @description         Simplifies adding info to FA uploads by making things semi-automatic. Edit 'charList' to add/remove character options, and 'tagList' to add/remove frequently used tag groups.
// @author              Fill783
// @namespace           https://github.com/Fill783/FA-Helper
// @icon                https://www.furaffinity.net/themes/beta/img/favicon.ico
// @match               https://www.furaffinity.net/submit/finalize/
// @grant               none
// ==/UserScript==

(function(){
    'use strict'

    //Features:
    //Easily add artist credit and links. Script will set " - by [artist name]" as the title, and include a link to the artist in the description.
    //The artist link will change to a twitter link if an @ is included at the start of the artist's username.
    //Save characters to the charList and have them show up as checkboxes to automatically add character credits and tags.
    //Save groups of tags as well, in tagList, for frequently used tags.
    //Set certain words as mature or adult. If these words are added via your characters/tag groups, the script will adjust the rating accordingly.
    //Script will attempt to assign theme based on tags it adds. E.G: If one of the tags is "Paws", it might set that as the theme.
    //It will also attempt to assign a species if there's only one of a kind in the image, else it will leave it as "Any".
    //Script automatically changes the Category to "Digital" by default. This can be toggled off.
    //Lastly, if any of your FA folders match with one of the words in the tags (Such as a character name), it will select said folders.


    //User Config ----------------------------------------------------------------------------------------------------------------------------------------

    //Change these to = false if you would prefer that the script not attempt to set the category/theme/species/gender selection
    const setCategory = true; //This sets the category to "Digital" at the moment. Not much else.
    const setTheme = true; //Attempts to set the theme based on the tags provided
    const setSpecies = true; //Same as set theme but for species. Only sets a species if there's one of a kind in the image.
    const setGender = false; //Attempts to set gender based on characters selected. Selects "Multiple Characters" if more than one gender is present.
    const setFolders = true; //Toggles folders based on tags.

    //Script will auto-select rating after adding tags. Defaults to General, changes to mature if it finds mature words in the tags, upgrade to adult if it finds adult tags.
    //This is only based on character tags and tag groups that the script adds. Be sure to update the rating yourself if you add more tags manually!
    const matureTags = ["Booty"];
    const adultTags = ["Butt", "Tush"];

    //This is the start of the description, before character and artist credits are added
    const messageTemplate = 'Description goes here \r \r--------------------------------------------------------------\r';

    //add characters as:
    //         {
    //             "Character":    "Character Name.",
    //             "Species":     "Character Species. Works best if it aligns with a species in FA's "Species" dropdown, but it doesn't need to be one of those options.",
    //             "Gender":   "Character Gender. Optional.",
    //             "Credit":   "Character Credit, such as an FA Icon Link, or a twitter profile URL, or whatever works best for you.",
    //             "Tags":      "Character Tags, like name, species, and other important things"
    //         }
    //Character List. Add as amny characters as you like! Should (hopefully) scale infinitly.
    const charList =
          [
              {
                  "Character":    "Example Character",
                  "Species":     "Wolf",
                  "Gender":     "Male",
                  "Credit":   "Credit Example: :IconFender:",
                  "Tags":      "Put Tags Like Name And Species Here"
              },
              {
                  "Character":    "Another Example",
                  "Species":     "Dog",
                  "Credit":   "Credit 2: Original post [url=http://www.example.com/]You can also give credit with a URL, say, to a twitter profile.[/url]",
                  "Tags":      "Example Two Now With URL"
              }
          ]
    //Tag groups for frequently used tags
    const tagList =
          [
              {
                  "TagName":    "Example1",
                  "Tags":      "This Is A Example Keywords group"
              },
              {
                  "TagName":    "Example2",
                  "Tags":      "Seperate Keywords With Spaces"
              }
          ]

    //Script Past Here -------------------------------------------------------------------------------------------------------------------------------------------------------------------

    addComment(" FA Helper Script stuff past here! ");

    //Set targets for outputs
    const submissiontitle = document.getElementById('title'), tag = document.getElementById('keywords'), message = document.getElementById('message');

    //set up the container
    const containerDiv = document.createElement('div')

    document.body.appendChild(containerDiv)
    containerDiv.id = "containerDiv"
    containerDiv.classList.add("row")

    //set up collums
    const [ collDiv0, collDiv1 ] = [ document.createElement('div'), document.createElement('div') ]
    let colls = [ collDiv0, collDiv1 ]
    for (let i = 0; i < colls.length; i++) {
        containerDiv.appendChild(colls[i]);
        colls[i].classList.add("column");
        colls[i].id = 'coll'+i;
    };

    //adds button to page
    addInput('Artist (Include @ for Twitter)','textbox','artistName', collDiv0)
    addInput('Original art URL (Optional)','textbox','artURL', collDiv0)
    addButton('Add Tags', addInfo)

    //checkboxes for adding characters
    charList.forEach( element => { chkLabelPair(element.Character, collDiv1) } )
    //Checkboxes for tag groups
    tagList.forEach( element => { chkLabelPair(element.TagName, collDiv1) } )

    addStyle();


    function chkLabelPair(label, parent){
        addInput(label,'checkbox', label, parent)
        addAddLabel(label, parent)
    };
    function addButton(text, onclick) {
        let button = document.createElement('button')
        collDiv0.appendChild(button)
        collDiv0.appendChild(document.createElement("br"))
        button.innerHTML = text
        button.onclick = onclick
        button.classList.add("btnAddTags")
        return button
    };
    function addInput(text, type, id, parent) {
        let textBox = document.createElement('input')
        parent.appendChild(textBox)
        if(type != 'checkbox'){parent.appendChild(document.createElement("br"))}
        textBox.id = id
        textBox.type = type
        textBox.placeholder = text
        if(type == 'checkbox') {textBox.classList.add("charChk")}
        return textBox
    };
    function addAddLabel(text, parent) {
        let label = document.createElement('label')
        parent.appendChild(label)
        parent.appendChild(document.createElement("br"))
        label.innerHTML = text
        label.for = text
        label.classList.add("charNames")
        return label
    };
    function addComment(text){ document.body.appendChild(document.createComment(text)) };
    function addStyle() {
        //This is the CSS stuff. This is the bane of my existance. If you can make it better, please help ;w;
        let styleInsert = document.createElement('style')
        document.head.appendChild(styleInsert)
        styleInsert.innerHTML =
            "#containerDiv {position: absolute; top: 320px; right: 25%;  height: 200px; z-index: 3; }\r"
            +".row { display: flex; } .column { flex: auto; overflow: auto; width: auto}\r"
            +"#coll0 input, #coll1 { display: inline-block; background-color: rgba(0,0,0,.15); border: 1px #69697d solid!important; border-radius: 7px; outline: none; }\r"
            +"#coll0 input { padding: 5px 7px; margin: 0px 8px 4px 0px; box-sizing: border-box; min-height: 30px;  color: #e5e5e5; }\r"
            +"#coll1 { padding: 5px; color: #d6d9ed; }\r"
        return styleInsert
    };
    function addTags(tags){
        let splitTag = tags.Tags.split(' ')
        //Doesn't repeat tags
        splitTag.forEach(singleTag => { if(!tag.value.includes(singleTag)) { tag.value += singleTag + ` ` } })
    };

    //The script that actually does The Thing (AKA the button script)
    function addInfo() {
        //get info
        let artist = document.getElementById('artistName').value;
        let artURL = document.getElementById('artURL').value;
        const selectedChars = document.getElementsByClassName('charChk');
        let speciesList = []
        let genderList = []

        //Add Message template
        message.value = messageTemplate

        //Add character tags
        tag.value = ''
        charList.forEach(element => {
            for (let i = 0; i < selectedChars.length - tagList.length; i++) {
                if(element.Character == selectedChars[i].id && selectedChars[i].checked){
                    //Character credit
                    message.value += element.Credit + '\r'
                    //Character tags
                    addTags(element)
                    //add species to list
                    if (!speciesList.includes(element.Species)) { speciesList.push(element.Species) }
                    //add gender to list
                    if (!genderList.includes(element.Gender)) { genderList.push(element.Gender) }
                }
            }
        })
        //Add tag groups
        tagList.forEach(element => {
            for (let i = charList.length; i < selectedChars.length; i++) {
                    //Character tags
                if(element.TagName == selectedChars[i].id && selectedChars[i].checked){ addTags(element) }
            }
        });

        //Art Credit
        if(artist.length > 0){
            message.value += '\rArt by: '
            if(artist[0] == '@'){
                submissiontitle.value = " - By " + artist.substring(1)
                message.value += '[url=https://twitter.com/' + artist.substring(1) + ']' + artist + ' on Twitter[/url]. '
            }
            else{
                submissiontitle.value = " - By " + artist
                message.value += ':icon'+artist+":"
            }
        };

        //Original post link
        if(artURL.length > 0){
            if(artURL.includes('twitter.com') && artURL.includes('?')){
                //Shortens twitter link if needed
                artURL = artURL.split('?')[0];
            }
            message.value += 'Original post [url='+ artURL +'][Here][/url].';
        };

        //Set Catagory
        //I barely ever upload anything other than digital art, so I just set it to default to that. Might make it more programmatic later?
        document.getElementsByName("cat")[0].options[1].selected = true;

        //Set Rating
        let rating = 0;
        matureTags.forEach(mature => {
            if(tag.value.toLowerCase().includes(mature.toLowerCase())){
                rating = 2;
            }
        });

        adultTags.forEach(adult => {
            if(tag.value.toLowerCase().includes(adult.toLowerCase())){
                rating = 1;
            }
        });

        document.querySelector("input[value='"+rating+"']").checked = true;

        //Attempts to set theme based on tags
        if(setTheme){
            var theme = document.getElementsByName("atype")[0].options
            theme[0].selected = true;
            for (let i = 0; i < theme.length; i++) {
                if(tag.value.includes(theme[i].innerHTML.replace(/\s/g, ''))){ theme[i].selected = true; }
            }
        };

        //Attempt to set species if it's singular
        if(setSpecies){
            const species = document.getElementsByName("species")[0].options
            species[0].selected = true;
            if(speciesList.length == 1){
                for (let i = 0; i < species.length; i++) {
                    if(speciesList[0] == species[i].innerHTML.replace(' (Other)', '').replace(/\s/g, '')) { species[i].selected = true; }
                }
            }
        };

        //Attempt to set gender if it's singular
        if(setGender){
            const gender = document.getElementsByName("gender")[0].options
            gender[0].selected = true;
            if(genderList.length > 0){
                if( genderList.length > 1 ){ gender[8].selected = true; }
                else{
                    for (let i = 0; i < gender.length; i++) {
                        if(genderList[0] == gender[i].innerHTML.replace(/\s/g, '').replace('/NotSpecified', '')){ gender[i].selected = true; }
                    }
                }
            }
        };

        //Toggle folders that match tags
        if(setFolders){
            const folders = document.getElementsByClassName("folder_name")
            for (let i = 0; i < folders.length; i++) {
                folders[i].children[0].checked = tag.value.includes(folders[i].children[1].textContent);
            }
        };

        //End of AddInfo
    }
    //End of Script
}());