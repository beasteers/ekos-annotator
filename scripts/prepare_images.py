import pandas as pd
from pathlib import Path
import os
import shutil

def main(path_to_csv='mturk_batches_noun.csv',outpath = 'mturk_images',path_to_rgb='/rgb_frames',batch_size=9):
    os.makedirs(outpath,exist_ok=True)
    df = pd.read_csv(path_to_csv)
    for i in range(len(df)):
        curr_batch = df.iloc[i]
        for j in range(1,batch_size+1):
            image_metadata = curr_batch[f'image_{j}_file_name']
            participant, video, action, frame = image_metadata.split('_')
            frame = int(frame.split('.')[0])
            frame_path = Path(path_to_rgb, f'{participant}_{video}') / f'frame_{frame:010}.jpg'
            shutil.copy(frame_path,Path(outpath)/image_metadata)

if __name__ == "__main__":
    import fire
    fire.Fire(main)

'''
Output images into a folder.

Match filename structure in prepare_batches.py (e.g. "{narration_id}_{frame_id}.jpg")

noun_frames
predicate_frames

'''
