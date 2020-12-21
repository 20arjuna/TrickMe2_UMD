# TrickMe2
This repository contains the code for the TrickMe2 Interface.

# Motivation
Current QA models perform poorly on questions centered around underrepresented entities. This is in part due to biases in data that is being used to train these models. This includes underrepresentation of minorities and women, as well as a lack of focus on individuals from nonwestern countries. As QA models continue to perform at higher and higher levels, it is important that the data being used to train these models accurately portrays the diverse world we live in.

# What this repo contains
* Note: Project is still under development
<br>
To rectify this, we are building an adversarial question writing interface with a human-in-the-loop and a specific emphasis on generating questions that either contain or are about underrepresented groups. Quiz Bowl authors will write their question while the interface
analyzes the contents of their question. Specifically, it performs Named Entity Recognition (NER) to identify important entities
in the question. The Interface then creates suggestions that are related to the entities originally included but belong to underrepresented
groups instead. For example, if an author writes a question about Howard Hughes, the well known movie producer, the interface may suggest
that they include Esther Eng: the first female director to direct Chinese-language films in the United States.


# Using TrickMe2
- Clone this repo using: ```git clone github.com/20arjuna/TrickMe2_UMD```
- Launch frontend using: ```yarn start```
- Navigate into backend directory using: ```cd backend```
- Launch virtual environment using ```. venv/bin/activate```
- Install dependencies using: ```pip install -r requirements.txt```
- Launch backend using: ```yarn start-backend```
- Use the interface by navigating to ```localhost:3000``` in your browser
