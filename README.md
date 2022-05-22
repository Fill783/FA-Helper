# FA-Helper
A TamperMonkey script that adds extra functions to the FA upload page to make it easier to tag things.

Features: 
• Easily add artist credit and links. Script will set " - by [artist name]" as the title, and include a link to the artist in the description.  
• The artist link will change to a twitter link if an @ is included at the start of the artist's username.  
• Save characters to the charList and have them show up as checkboxes to automatically add character credits and tags.  
• Save groups of tags as well, in tagList, for frequently used tags.  
• Set certain words as mature or adult. If these words are added via your characters/tag groups, the script will adjust the rating accordingly. 
• Script will attempt to assign theme based on tags it adds. E.G: If one of the tags is "Paws", it might set that as the theme. 
• It will also attempt to assign a species if there's only one of a kind in the image, else it will leave it as "Any".  
• Script automatically changes the Category to "Digital" by default. This can be toggled off. 
• Lastly, if any of your FA folders match with one of the words in the tags (Such as a character name), it will select said folders.  
