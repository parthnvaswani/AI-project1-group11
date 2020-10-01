# This will import built-in python library json and downloaded nltk library
import json,nltk
# FuzzyWuzzy is a library of Python which is used for string matching.
from fuzzywuzzy import fuzz, process
# Tokenization is the process by which big quantity of text is divided into smaller parts called tokens. 
# These tokens are very useful for finding such patterns.
from nltk.tokenize import word_tokenize, RegexpTokenizer

def refine(text):

    # Reading the slangs from the json file.
    with open('data/slangs.json','r') as f:

        # The read function will return every character in the file as string, which is in json format. 
        # So we have to decode the data from the json, json.loads will return a dictionary of slang:meaning, 
        # which will be stored in the variable, named slangs.
        slangs=json.loads(f.read())

    # Creating a blank list, for storing every single word in same order after processing.
    processed=[]

    # this loop will be iterated over every word in message, which is tokenized by nltk word tokenizer.
    for msg in word_tokenize(text):

        # check if message contains letter, digit, or underscore only.
        if (RegexpTokenizer(r'\w+').tokenize(msg)):

            # This is the main part of algorithm, where it will check fuzz ratio for word of message and slangs, 
            # and if score is greater than 80. This will return all matched words in tuple form, 
            # which is member of list.

            p1=[possible for possible in process.extract(msg,[i for i in slangs],scorer=fuzz.ratio) if possible[1]>80]

            #if p1 is not empty, this will send full form of the slang to list, named processed.
            processed.append(slangs[p1[0][0]] if len(p1)>0  else msg)

        # else message contains characters other than alphanumeric, word will be appended as it is in the list. 
        else:
            processed.append(msg)
            
    # All the words are processed, and they are placed in order. 
    # Now it's time to tie them all in single string. 
    # All the words will be separated by spaces only, As it should be.
    return ' '.join(map(str,processed))