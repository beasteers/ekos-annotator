import os
import csv
import json
import boto3

# https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lazada.com.ph%2Fproducts%2Fthe-newly-launched-pokemon-three-silly-cute-big-eyes-funny-charmander-bulbasaur-high-value-figure-car-home-decoration-toys-i4079442371.html&psig=AOvVaw3qsAYkbCtr-gToqNKwMH1x&ust=1717549223281000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCODPr9HfwIYDFQAAAAAdAAAAABAK

# Initialize MTurk client
mturk = boto3.client('mturk',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('YOUR_AWS_SECRET_KEY'),
    region_name='us-east-1',  # Or your preferred region
)

# Check your balance
print("Account balance: ", mturk.get_account_balance()['AvailableBalance'])

# Function to create HIT
def create_hit(image_batch):
    question_template = open('template.html', 'r').read()
    
    # Format the question with image paths
    question = question_template.format(
        **{f'image{i}': img_path for i, img_path in enumerate(image_batch, start=1)}
    )
    
    response = mturk.create_hit(
        Title='Image Annotation Task',
        Description='Annotate images by checking if the labels are correct.',
        Keywords='image, annotation, labeling',
        Reward='0.10',  # Reward per HIT
        MaxAssignments=1,  # Number of workers per HIT
        LifetimeInSeconds=604800,  # 1 week
        AssignmentDurationInSeconds=600,  # 10 minutes
        Question=question,
        QualificationRequirements=[
            {
                'QualificationTypeId': '00000000000000000071',
                'Comparator': 'EqualTo',
                'LocaleValues': [{'Country': 'US'}],
                'RequiredToPreview': True,
            }
        ]
    )
    return response['HIT']['HITId']

# Load your CSV file
with open('data.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)
    next(reader)  # Skip header
    batches = []
    batch = []
    
    for row in reader:
        batch.append(row[0])  # Append image_path
        if len(batch) == 9:
            batches.append(batch)
            batch = []
    
    # If there are any remaining images in the last batch
    if batch:
        batches.append(batch)

# Create HITs for each batch
hit_ids = []
for batch in batches:
    hit_id = create_hit(batch)
    hit_ids.append(hit_id)

# Save HIT IDs to a file
with open('hit_ids.json', 'w') as f:
    json.dump(hit_ids, f)

print("Created HITs and saved HIT IDs.")