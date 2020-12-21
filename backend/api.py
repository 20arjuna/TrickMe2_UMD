from flask import Flask, render_template, request
import wikipedia
from nltk.tag.stanford import StanfordNERTagger
import nltk, string
from wikidata.client import Client
import requests
import json
import random
from SPARQLWrapper import SPARQLWrapper, JSON
import pandas as pd

app = Flask(__name__)


nltk.download('punkt') # if necessary...
stemmer = nltk.stem.porter.PorterStemmer()
remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)

@app.route('/link', methods=['POST'])
def get_input():
    file1 = open("input.txt","w")
    file1.write("")
    question = ""
    print("got here baby!")
    print(request.json)
    question = request.json['question']

    #driver(question) #starting main backend logic

    file1 = open("input.txt","w")
    file1.write(question)
    file1.close()

    hello = post_output()

    return hello

@app.route('/suggestions', methods=['GET'])
def post_output():
    print('im here')
    question = ""
    file1 = open("input.txt","r")
    question = file1.read()
    file1.close()

    output = driver(question)

    #print("GET REQUEST: " + question)
    return {'output': output}


##### Helpers ############
def stem_tokens(tokens):
    return [stemmer.stem(item) for item in tokens]

'''remove punctuation, lowercase, stem'''
def normalize(text):
    return stem_tokens(nltk.word_tokenize(text.lower().translate(remove_punctuation_map)))


def get_continuous_chunks(tagged_sent):
    continuous_chunk = []
    current_chunk = []

    for token, tag in tagged_sent:
        if tag != "O":
            current_chunk.append((token, tag))
        else:
            if current_chunk: # if the current chunk is not empty
                continuous_chunk.append(current_chunk)
                current_chunk = []
    # Flush the final current_chunk into the continuous_chunk, if any.
    if current_chunk:
        continuous_chunk.append(current_chunk)
    return continuous_chunk







def link_entities(question):
    st = StanfordNERTagger('stanford-ner/classifiers/english.all.3class.distsim.crf.ser.gz', 'stanford-ner/stanford-ner.jar')
    tagged_sent = st.tag(question.split())
    named_entities = get_continuous_chunks(tagged_sent)
    named_entities_str_tag = [(" ".join([token for token, tag in ne]), ne[0][1]) for ne in named_entities]

    #print(named_entities[0])
    result = []
    for entity in named_entities_str_tag:
        if(entity[1] == 'PERSON'):
            result.append(entity[0])

    return result




def get_id(query):
    url = "https://www.wikidata.org/w/api.php"

    params = {
        "action": "wbsearchentities",
        "language": "en",
        "format": "json",
        "search": query
    }
    try:
        response = requests.get(url, params=params)
        json_data = json.loads(response.text)

        id = json_data["search"][0]["id"]
        return id
    except:
        return False



def get_props(id):
    client = Client()
    entity = client.get(id, load=True)
    try:
        occ_prop = str(entity[client.get("P106")])
        occupation_id = occ_prop[occ_prop.find(' ')+1 : occ_prop.find('>')]

        nat_prop = str(entity[client.get("P27")])
        nationality_id = nat_prop[nat_prop.find(' ')+1 : nat_prop.find('>')]

        b_prop = str(entity[client.get("P569")])
        birthday = b_prop[b_prop.find(' ')+1 : b_prop.find('>')]

        limitYear = int(birthday[:4]) + 15
        birthdayLimit = str(limitYear) + "-01-01"


        props = [occupation_id, nationality_id, birthday, birthdayLimit]

        return props
    except:
        return False



def make_sparql_request(entity_id, propList):
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")

    sparql.setQuery(
        """SELECT ?person ?personLabel

        WHERE
        {
            ?person wdt:P21 wd:Q6581072 .
            ?person wdt:P172 ?race .
            ?person wdt:P106 wd:""" + propList[0] + """ .
            ?person wdt:P569 ?birth .
            ?person wdt:P27 wd:""" + propList[1] + """ .


            filter (?birth > """ + "'" + propList[2] + "'" + """ ^^xsd:dateTime && ?birth < """ + "'" + propList[3] + "'" + """^^xsd:dateTime)

            SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
            }
        }
    """)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    try:
        results_df = pd.io.json.json_normalize(results['results']['bindings'])
        return pd.Series.tolist(results_df["personLabel.value"].head())
    except:
        return False


def get_suggestions(entity):
    if(get_id(entity) != False):
        id = get_id(entity)
        if(get_props(id)):
            props = get_props(id)
            return make_sparql_request(id, props)
        else:
            return ["False"]
    else:
        return False







def driver(question):
    entities = link_entities(question)
    suggestionMap = dict()
    suggestionList = ""
    output = ""
    print(entities)
    #entities = ['Eugene Dennis', 'Joseph McCarthy']
    for e in entities:
        temp = get_suggestions(e)
        if(temp != False):
            suggestionList = str(list(set(temp)))
            if(suggestionList != "['False']"):
                print("holy smokes!" + suggestionList)
                suggestionMap[e] = suggestionList
                output += "Because you mentioned " + str(e) + " we suggest you talk about: " + suggestionList + "\n\n"

    print("map: " + str(suggestionMap))
    if(bool(suggestionMap) == False):
        return "Nothing to Suggest!"
    else:
        return output
