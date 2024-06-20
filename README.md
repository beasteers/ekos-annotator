# EKOS Image Annotator

## Task Definitions

### Task 1: Noun

Title: assess quality of egocentric image annotations [correct/incorrect]

Description: You will be presented with a batch of images with object masks drawn on them. You must assess whether the noun label describes the content of the mask.

Keywords: image, classification, batch, assess, quality, automatic, object, masks

```html
<div class="ekos-annotator">
	<script type="application/json">
			{
        "task": "noun",
				"noun": "$noun",
			  "baseUrl": "https://ekos-mturk-test-samples.s3.us-east-2.amazonaws.com/frames",
				"images": [
					{"file_name": "$image_1_file_name"},
					{"file_name": "$image_2_file_name"},
					{"file_name": "$image_3_file_name"},
					{"file_name": "$image_4_file_name"},
					{"file_name": "$image_5_file_name"},
					{"file_name": "$image_6_file_name"},
					{"file_name": "$image_7_file_name"},
					{"file_name": "$image_8_file_name"},
					{"file_name": "$image_9_file_name"}
				]
			}
		  </script>
	</div>
<script src="https://cdn.jsdelivr.net/gh/beasteers/ekos-annotator@main/build/bundle.js" data-mount-in=".ekos-annotator" type="text/javascript"></script>
```

### Task 2: Predicates

Title: assess quality of egocentric object statements [correct/incorrect]

Description: You will be presented with a batch of images. You must assess whether the statement about an object in the image is true.

Keywords: image, classification, batch, assess, quality, predicates, logic, object, state

```html
<div class="ekos-annotator">
	<script type="application/json">
			{
        "task": "predicate",
				"noun": "$noun",
        "predicate": "$predicate",
			  "baseUrl": "https://ekos-mturk-test-samples.s3.us-east-2.amazonaws.com/frames",
				"images": [
					{"file_name": "$image_1_file_name"},
					{"file_name": "$image_2_file_name"},
					{"file_name": "$image_3_file_name"},
					{"file_name": "$image_4_file_name"},
					{"file_name": "$image_5_file_name"},
					{"file_name": "$image_6_file_name"},
					{"file_name": "$image_7_file_name"},
					{"file_name": "$image_8_file_name"},
					{"file_name": "$image_9_file_name"}
				]
			}
		  </script>
	</div>
<script src="https://cdn.jsdelivr.net/gh/beasteers/ekos-annotator@main/build/bundle.js" data-mount-in=".ekos-annotator" type="text/javascript"></script>
```
## Update jsdelivr
You have to purge their cache

Go to https://www.jsdelivr.com/tools/purge
```

```