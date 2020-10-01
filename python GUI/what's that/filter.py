# This will import built-in python libraries, 
# where re is for regex and json is for encoding to and decoding json data.
import json,re

def filter(text):
    
    # Reading the curse words from the json file.
    with open('data/curseWords.json','r') as f:
        
        # The read function will return every character in the file as a string, which is in json format. 
        # So we have to decode the data from the json, json.loads will return a list of curse words, 
        # which will be stored in the variable, named curseWords.
        curseWords=json.loads(f.read())
    
    # The join() method takes all items in an iterable (i.e. curseWords) and joins them into one string. 
    # Here, pipe( | ) is used as a delimiter to join every curse words, 
    # so this will return output as string separated by pipe. 
    # Str in map function will convert every element of list into a string.
    r='|'.join(map(str,curseWords))
    
    # To translate the characters in the string translate() is used to make the translations. 
    # This function uses the translation mapping specified using the maketrans(). 
    # The translate function has been used to convert special characters to escape sequence that are already in the file. 
    # Now it is ready to go into regex.
    g=r.translate(str.maketrans({'*': '[*]', '$': '[$]','-':'[-]','/':'[/]','\\':'[\]','^':'\^','+':'[+]','?':'[?]','.':'[.]', '(':'[(]', ')':'[)]', '[':'[[]', ']':'[]]', '{':'[{]', '}':'[}]'}))
    
    # Now we are replacing the curse words (whatever matches the inserted text) with asterisks.
    return re.sub(g,'****',text)