# EKOS Image Annotator

## Task Definitions

### Task 1: Noun

Title: assess quality of egocentric image annotations [correct/incorrect]

Description: You will be presented with a batch of images with object masks drawn on them. You must assess whether the noun label describes the content of the mask.

Keywords: image, classification, batch, assess, quality, automatic, object, masks

```html
<form>
	<div class="ekos-annotator">
		<script type="application/json">
			{
				"baseUrl": "https://ekos-mturk-test-samples.s3.us-east-2.amazonaws.com/mturk_images_noun",
				"noun": "${noun}",
				"task": "noun",
				"batchId": "${batchId}",
				"images": [
					{ "file_name": "${image_1_file_name}", "polygons": ${image_1_polygons}, "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_2_file_name}", "polygons": ${image_2_polygons}, "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_3_file_name}", "polygons": ${image_3_polygons}, "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_4_file_name}", "polygons": ${image_4_polygons}, "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_5_file_name}", "polygons": ${image_5_polygons}, "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_6_file_name}", "polygons": ${image_6_polygons}, "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_7_file_name}", "polygons": ${image_7_polygons}, "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_8_file_name}", "polygons": ${image_8_polygons}, "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_9_file_name}", "polygons": ${image_9_polygons}, "bullshit": "asdfasdf fixes parse error" }
				]
			}
			</script>
	</div>
	<script src="https://cdn.jsdelivr.net/gh/beasteers/ekos-annotator@v0.0.5/build/bundle.js" data-mount-in=".ekos-annotator" type="text/javascript"></script>
    <input type="submit" style="display: none" name="mturk_submit" disabled style="display: none" />
</form>
```

### Task 2: Predicates

Title: assess quality of egocentric object statements [correct/incorrect]

Description: You will be presented with a batch of images. You must assess whether the statement about an object in the image is true.

Keywords: image, classification, batch, assess, quality, predicates, logic, object, state

```html
<form>
	<div class="ekos-annotator">
		<script type="application/json">
			{
				"baseUrl": "https://ekos-mturk-test-samples.s3.us-east-2.amazonaws.com/mturk_images_predicate",
				"noun": "${noun}",
				"state": "${state}",
				"task": "predicate",
				"batchId": "${batchId}",
				"images": [
					{ "file_name": "${image_1_file_name}", "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_2_file_name}", "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_3_file_name}", "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_4_file_name}", "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_5_file_name}", "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_6_file_name}", "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_7_file_name}", "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_8_file_name}", "bullshit": "asdfasdf fixes parse error" },
					{ "file_name": "${image_9_file_name}", "bullshit": "asdfasdf fixes parse error" }
				]
			}
		</script>
	</div>
	<script src="https://cdn.jsdelivr.net/gh/beasteers/ekos-annotator@v0.0.5/build/bundle.js" data-mount-in=".ekos-annotator" type="text/javascript"></script>
    <input type="submit" style="display: none" name="mturk_submit" disabled style="display: none" />
</form>
```
## Update jsdelivr
You have to purge their cache

Go to https://www.jsdelivr.com/tools/purge
```
https://cdn.jsdelivr.net/gh/beasteers/ekos-annotator@main/build/bundle.js
```

```
function dumpForm(form) {
  return (
    [...new FormData(form).entries()].reduce((acc, [key, value]) => {
      acc[key] = acc[key] ? [].concat(acc[key], value) : value;
      return acc;
    }, {})
  );
}
```