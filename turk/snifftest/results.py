import boto3
import pandas as pd
import json
from xml.etree import ElementTree as ET

# Initialize MTurk client
mturk = boto3.client('mturk',
    aws_access_key_id='YOUR_AWS_ACCESS_KEY',
    aws_secret_access_key='YOUR_AWS_SECRET_KEY',
    region_name='us-east-1',  # Or your preferred region
)

# Load HIT IDs from the file
with open('hit_ids.json', 'r') as f:
    hit_ids = json.load(f)

results = []

def parse_answer(xml_answer):
    root = ET.fromstring(xml_answer)
    answers = {}
    for answer in root.findall('.//Answer'):
        question_id = answer.find('QuestionIdentifier').text
        answer_value = answer.find('FreeText').text
        answers[question_id] = answer_value
    return answers

for hit_id in hit_ids:
    response = mturk.list_assignments_for_hit(HITId=hit_id)
    assignments = response['Assignments']
    
    for assignment in assignments:
        worker_id = assignment['WorkerId']
        answers_xml = assignment['Answer']
        answers = parse_answer(answers_xml)
        
        results.append({
            'worker_id': worker_id,
            'hit_id': hit_id,
            'answers': answers,
        })

# Save results to a DataFrame
df = pd.DataFrame(results)
df.to_csv('results.csv', index=False)

print("Collected results and saved to results.csv.")
